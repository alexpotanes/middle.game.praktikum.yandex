import { Scene } from '../core/Scene'
import { Easings, Tween, TweenManager } from '../animation/Tween'
import { HexGrid } from '../hex/HexGrid'
import { hexKey, hexNeighbors, hexEquals } from '../hex/hexMath'
import type { AxialCoord } from '../hex/hexMath'
import type { InputManager } from '../input/InputManager'
import { distance, lerp } from '../math/Vector2'
import type { Vector2 } from '../math/Vector2'
import type { Renderer } from '../render/Renderer'
import {
  BOARD_RADIUS,
  COINS_PER_UNIT_TOTAL,
  ROYAL,
  UNIT_DEFS,
  getTactic,
  hexagonCoords,
  validateAction,
} from '@warchest/shared'
import type {
  Coin,
  GameAction,
  MatchState,
  PlayerIndex,
  PlayerState,
  UnitId,
} from '@warchest/shared'

const HEX_SIZE = 36
const GRID_ORIGIN: Vector2 = { x: 400, y: 290 }
const HAND_Y = 555
const OPPONENT_HAND_Y = 45
const COIN_RADIUS = 24
const COIN_SPACING = 64
const SUPPLY_SLOT_RADIUS = 16
const SUPPLY_SLOT_SPACING = 46
const SUPPLY_SLOT_X = 52
const SIDE_PANEL_X = 700
const ACTION_BUTTON_RADIUS = 10
const ACTION_BUTTON_SPACING = 24
const ACTION_BUTTON_OFFSET_Y = 20
const DECK_BUTTON_CENTER: Vector2 = { x: 20, y: HAND_Y }
const OPPONENT_DECK_BUTTON_CENTER: Vector2 = { x: 20, y: OPPONENT_HAND_Y }
const DECK_BUTTON_RADIUS = 14
const CARD_WIDTH = 140
const CARD_HEIGHT = 216
const CARD_GAP = 24

const ACTION_BUTTON_STYLE: Record<string, { label: string; color: string }> = {
  attack: { label: 'А', color: '#a03a30' },
  tactic: { label: 'Т', color: '#5b4a8a' },
  control: { label: 'З', color: '#2d4a94' },
}

const PLAYER_COLORS = ['#c9a24c', '#7c2626']

const PALETTE = {
  hexFill: '#f5edda',
  hexStroke: '#b9a98c',
  location: '#8d8d8d',
  legal: '#e8c877',
  legalStroke: '#7a9b57',
  attack: '#e5a49b',
  attackStroke: '#a03a30',
  tactic: '#c9a8e8',
  tacticStroke: '#5b4a8a',
  controlStroke: '#2d4a94',
  text: '#564844',
  coinBack: '#b8b0a2',
  bag: '#7a9b57',
}

type Selection =
  { kind: 'hand'; coinId: number } | { kind: 'unit'; at: AxialCoord }

type LegalTarget = { action: GameAction; kind: string }

export interface WarChestSceneCallbacks {
  sendAction: (action: GameAction) => void
}

export class WarChestScene extends Scene {
  private readonly grid: HexGrid

  private readonly tweens = new TweenManager()
  private readonly animations = new Map<number, Vector2>()

  private state: MatchState | null = null
  private selection: Selection | null = null
  private legalTargets = new Map<string, LegalTarget[]>()
  private hoveredKey: string | null = null
  private deckView: PlayerIndex | null = null

  constructor(
    private readonly you: PlayerIndex,
    private readonly callbacks: WarChestSceneCallbacks
  ) {
    super()
    this.grid = new HexGrid({ size: HEX_SIZE, origin: GRID_ORIGIN })
    for (const coord of hexagonCoords(BOARD_RADIUS)) {
      this.grid.addCell(this.toView(coord))
    }
  }

  private toView(coord: AxialCoord): AxialCoord {
    return this.you === 1 ? { q: -coord.q, r: -coord.r } : coord
  }

  setMatchState(state: MatchState): void {
    const prev = this.state
    this.state = state
    this.selection = null
    this.legalTargets.clear()
    if (prev) {
      this.startAnimations(prev, state)
    }
  }

  update(dt: number, input: InputManager): void {
    super.update(dt, input)
    this.tweens.update(dt)

    const mouse = input.getMouse()
    const hoveredCell = this.grid.hitTest(mouse.position)
    this.hoveredKey = hoveredCell ? hexKey(hoveredCell.coord) : null

    if (input.wasKeyPressed('Escape')) {
      if (this.deckView !== null) {
        this.deckView = null
      } else {
        this.clearSelection()
      }
    }
    this.handleHotkeys(input)

    if (input.wasMouseClicked()) {
      this.handleClick(mouse.position)
    }
  }

  render(renderer: Renderer): void {
    this.renderBoard(renderer)
    this.renderUnits(renderer)
    this.renderActionButtons(renderer)
    this.renderHands(renderer)
    this.renderHints(renderer)
    this.renderDeckModal(renderer)
  }

  private get isYourTurn(): boolean {
    return (
      this.state !== null &&
      this.state.winner === null &&
      this.state.activePlayer === this.you &&
      !this.state.players[this.you].passed
    )
  }

  private handleHotkeys(input: InputManager): void {
    if (!this.isYourTurn || !this.state || this.deckView !== null) {
      return
    }
    const hand = this.yourHand()
    const selectedCoin =
      this.selection?.kind === 'hand'
        ? hand.find(item => item.id === this.selectedCoinId())
        : undefined

    if (input.wasKeyPressed('KeyP')) {
      const coin = selectedCoin ?? hand[0]
      if (coin) {
        this.dispatch({ type: 'pass', coinId: coin.id })
      }
    } else if (input.wasKeyPressed('KeyI')) {
      const coin = selectedCoin ?? hand[0]
      if (coin) {
        this.dispatch({ type: 'claimInitiative', coinId: coin.id })
      }
    } else if (input.wasKeyPressed('KeyR')) {
      const action = this.findRecruitAction(selectedCoin)
      if (action) {
        this.dispatch(action)
      }
    }
  }

  private selectedCoinId(): number {
    return (this.selection as { kind: 'hand'; coinId: number }).coinId
  }

  private findRecruitAction(preferred?: Coin): GameAction | null {
    if (!this.state) {
      return null
    }
    const state = this.state
    const hand = this.yourHand()
    const candidates = preferred
      ? [preferred, ...hand.filter(coin => coin.id !== preferred.id)]
      : hand
    for (const coin of candidates) {
      if (coin.unit === ROYAL) {
        const unitId = (this.state.players[this.you].units ?? []).find(
          unit =>
            validateAction(state, this.you, {
              type: 'recruit',
              coinId: coin.id,
              unitId: unit,
            }) === null
        )
        if (unitId) {
          return { type: 'recruit', coinId: coin.id, unitId }
        }
      } else if (
        validateAction(state, this.you, {
          type: 'recruit',
          coinId: coin.id,
          unitId: coin.unit,
        }) === null
      ) {
        return { type: 'recruit', coinId: coin.id, unitId: coin.unit }
      }
    }
    return null
  }

  private handleClick(position: Vector2): void {
    if (!this.state) {
      return
    }

    if (this.deckView !== null) {
      const layout = this.deckLayout(this.deckView)
      const insidePanel =
        position.x >= layout.x &&
        position.x <= layout.x + layout.width &&
        position.y >= layout.y &&
        position.y <= layout.y + layout.height
      if (
        distance(position, layout.close.center) <= layout.close.radius + 2 ||
        !insidePanel
      ) {
        this.deckView = null
      }
      return
    }

    if (distance(position, DECK_BUTTON_CENTER) <= DECK_BUTTON_RADIUS + 2) {
      this.deckView = this.you
      return
    }
    if (
      distance(position, OPPONENT_DECK_BUTTON_CENTER) <=
      DECK_BUTTON_RADIUS + 2
    ) {
      this.deckView = this.you === 0 ? 1 : 0
      return
    }

    if (!this.isYourTurn) {
      return
    }

    for (const button of this.actionButtons()) {
      if (distance(position, button.center) <= ACTION_BUTTON_RADIUS + 2) {
        this.dispatch(button.target.action)
        return
      }
    }

    const handCoinId = this.handCoinAt(position)
    if (handCoinId !== null) {
      this.toggleHandSelection(handCoinId)
      return
    }

    if (this.selection?.kind === 'hand') {
      const supplyUnit = this.supplyUnitAt(position)
      if (supplyUnit) {
        const action: GameAction = {
          type: 'recruit',
          coinId: this.selection.coinId,
          unitId: supplyUnit,
        }
        if (validateAction(this.state, this.you, action) === null) {
          this.dispatch(action)
        }
        return
      }
    }

    const cell = this.grid.hitTest(position)
    if (!cell) {
      this.clearSelection()
      return
    }
    const key = hexKey(cell.coord)

    const targets = this.legalTargets.get(key)
    if (targets?.length === 1 && targets[0].kind !== 'control') {
      this.dispatch(targets[0].action)
      return
    }

    const cellState = this.state.board[hexKey(this.toView(cell.coord))]
    if (cellState?.unit && cellState.unit.owner === this.you) {
      this.toggleUnitSelection(this.toView(cell.coord))
      return
    }

    this.clearSelection()
  }

  private toggleHandSelection(coinId: number): void {
    if (this.selection?.kind === 'hand' && this.selection.coinId === coinId) {
      this.clearSelection()
      return
    }
    this.selection = { kind: 'hand', coinId }
    this.computeLegalTargets()
  }

  private toggleUnitSelection(at: AxialCoord): void {
    if (this.selection?.kind === 'unit' && hexEquals(this.selection.at, at)) {
      this.clearSelection()
      return
    }
    this.selection = { kind: 'unit', at }
    this.computeLegalTargets()
  }

  private clearSelection(): void {
    this.selection = null
    this.legalTargets.clear()
  }

  private dispatch(action: GameAction): void {
    this.callbacks.sendAction(action)
    this.clearSelection()
  }

  private computeLegalTargets(): void {
    this.legalTargets.clear()
    if (!this.state || !this.selection) {
      return
    }
    const state = this.state

    const tryAdd = (action: GameAction, at: AxialCoord, kind: string) => {
      if (validateAction(state, this.you, action) === null) {
        const key = hexKey(this.toView(at))
        const list = this.legalTargets.get(key) ?? []
        if (list.some(target => target.kind === kind)) {
          return
        }
        list.push({ action, kind })
        this.legalTargets.set(key, list)
      }
    }

    if (this.selection.kind === 'hand') {
      const { coinId } = this.selection
      for (const cell of Object.values(state.board)) {
        tryAdd({ type: 'deploy', coinId, to: cell.coord }, cell.coord, 'deploy')
        tryAdd(
          { type: 'bolster', coinId, to: cell.coord },
          cell.coord,
          'bolster'
        )
      }
      return
    }

    const unitCell = state.board[hexKey(this.selection.at)]
    const unitType = unitCell?.unit?.coins[0]?.unit
    if (!unitType) {
      return
    }
    const coin = this.yourHand().find(item => item.unit === unitType)
    if (!coin) {
      return
    }
    const at = this.selection.at
    tryAdd({ type: 'control', coinId: coin.id, at }, at, 'control')
    for (const neighbor of hexNeighbors(at)) {
      tryAdd(
        { type: 'move', coinId: coin.id, from: at, to: neighbor },
        neighbor,
        'move'
      )
      tryAdd(
        { type: 'attack', coinId: coin.id, target: neighbor },
        neighbor,
        'attack'
      )
    }
    const range = getTactic(unitType)?.moveRange() ?? 1
    if (range > 1) {
      for (const cell of Object.values(state.board)) {
        tryAdd(
          { type: 'move', coinId: coin.id, from: at, to: cell.coord },
          cell.coord,
          'move'
        )
      }
    }
    const tactic = getTactic(unitType)
    if (tactic?.kind === 'active') {
      for (const target of tactic.activeTargets(state, this.you, at)) {
        tryAdd({ type: 'tactic', coinId: coin.id, target }, target, 'tactic')
      }
    }
  }

  private yourHand() {
    return this.state?.players[this.you].hand ?? []
  }

  private handSlotCenter(index: number, total: number, y: number): Vector2 {
    return {
      x: 400 - ((total - 1) * COIN_SPACING) / 2 + index * COIN_SPACING,
      y,
    }
  }

  private supplySlotCenter(index: number, y: number): Vector2 {
    return { x: SUPPLY_SLOT_X + index * SUPPLY_SLOT_SPACING, y }
  }

  private supplyUnitAt(position: Vector2): UnitId | null {
    const me = this.state?.players[this.you]
    if (!me) {
      return null
    }
    const units = me.units ?? []
    for (let i = 0; i < units.length; i++) {
      const unit = units[i]
      if (!me.supply.some(coin => coin.unit === unit)) {
        continue
      }
      if (
        distance(position, this.supplySlotCenter(i, HAND_Y)) <=
        SUPPLY_SLOT_RADIUS
      ) {
        return unit
      }
    }
    return null
  }

  private handCoinAt(position: Vector2): number | null {
    const hand = this.yourHand()
    for (let i = 0; i < hand.length; i++) {
      if (
        distance(position, this.handSlotCenter(i, hand.length, HAND_Y)) <=
        COIN_RADIUS
      ) {
        return hand[i].id
      }
    }
    return null
  }

  private renderBoard(renderer: Renderer): void {
    if (!this.state) {
      return
    }
    this.grid.render(renderer, cell => {
      const key = hexKey(cell.coord)
      const targets = this.legalTargets.get(key)
      const kinds = new Set(targets?.map(target => target.kind))
      const isSelectedUnit =
        this.selection?.kind === 'unit' &&
        hexEquals(this.toView(this.selection.at), cell.coord)

      let fill = PALETTE.hexFill
      let stroke = PALETTE.hexStroke
      if (kinds.has('attack')) {
        fill = PALETTE.attack
        stroke = PALETTE.attackStroke
      } else if (kinds.has('tactic')) {
        fill = PALETTE.tactic
        stroke = PALETTE.tacticStroke
      } else if (kinds.has('control')) {
        fill = PALETTE.legal
        stroke = PALETTE.controlStroke
      } else if (targets?.length) {
        fill = PALETTE.legal
        stroke = PALETTE.legalStroke
      } else if (isSelectedUnit) {
        fill = PALETTE.legal
      } else if (this.hoveredKey === key && this.isYourTurn) {
        fill = '#efe5cc'
      }
      return { fill, stroke }
    })

    for (const cell of this.grid.getAllCells()) {
      const cellState = this.state.board[hexKey(this.toView(cell.coord))]
      if (!cellState?.isLocation) {
        continue
      }
      renderer.fillCircle(cell.center, 5, PALETTE.location)
      if (cellState.control !== undefined) {
        const ctx = renderer.context
        ctx.strokeStyle = PLAYER_COLORS[cellState.control]
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(cell.center.x, cell.center.y, 10, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  private actionButtons(): { center: Vector2; target: LegalTarget }[] {
    const buttons: { center: Vector2; target: LegalTarget }[] = []
    for (const [key, targets] of this.legalTargets) {
      const needsButtons =
        targets.length > 1 || targets.some(target => target.kind === 'control')
      if (!needsButtons) {
        continue
      }
      const cell = this.grid.getAllCells().find(c => hexKey(c.coord) === key)
      if (!cell) {
        continue
      }
      targets.forEach((target, index) => {
        buttons.push({
          center: {
            x:
              cell.center.x +
              (index - (targets.length - 1) / 2) * ACTION_BUTTON_SPACING,
            y: cell.center.y + ACTION_BUTTON_OFFSET_Y,
          },
          target,
        })
      })
    }
    return buttons
  }

  private renderActionButtons(renderer: Renderer): void {
    for (const button of this.actionButtons()) {
      const style = ACTION_BUTTON_STYLE[button.target.kind] ?? {
        label: '?',
        color: PALETTE.text,
      }
      renderer.fillCircle(button.center, ACTION_BUTTON_RADIUS, style.color)
      renderer.drawText(style.label, button.center, {
        color: '#f5f2ef',
        font: 'bold 11px sans-serif',
        align: 'center',
        baseline: 'middle',
      })
    }
  }

  private renderUnits(renderer: Renderer): void {
    if (!this.state) {
      return
    }
    for (const cell of this.grid.getAllCells()) {
      const cellState = this.state.board[hexKey(this.toView(cell.coord))]
      const unit = cellState?.unit
      if (!unit) {
        continue
      }
      const topCoin = unit.coins[unit.coins.length - 1]
      const position = this.animations.get(topCoin.id) ?? cell.center
      const def = UNIT_DEFS[topCoin.unit]
      renderer.fillCircle(position, 18, def.color)
      const ctx = renderer.context
      ctx.strokeStyle = PLAYER_COLORS[unit.owner]
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(position.x, position.y, 18, 0, Math.PI * 2)
      ctx.stroke()
      renderer.drawText(def.letter, position, {
        color: '#f5f2ef',
        font: 'bold 16px sans-serif',
        align: 'center',
        baseline: 'middle',
      })
      if (unit.coins.length > 1) {
        renderer.drawText(
          String(unit.coins.length),
          { x: position.x + 14, y: position.y - 14 },
          {
            color: PALETTE.text,
            font: 'bold 12px sans-serif',
            align: 'center',
            baseline: 'middle',
          }
        )
      }
    }
  }

  private renderHands(renderer: Renderer): void {
    if (!this.state) {
      return
    }
    const opponent = this.state.players[this.you === 0 ? 1 : 0]
    this.renderSupply(renderer, opponent, OPPONENT_HAND_Y, false)
    this.renderBagAndDiscard(renderer, opponent, OPPONENT_HAND_Y)
    this.renderDeckButton(renderer, OPPONENT_DECK_BUTTON_CENTER)
    for (let i = 0; i < opponent.hand.length; i++) {
      renderer.fillCircle(
        this.handSlotCenter(i, opponent.hand.length, OPPONENT_HAND_Y),
        COIN_RADIUS - 6,
        PALETTE.coinBack
      )
    }

    const me = this.state.players[this.you]
    this.renderSupply(renderer, me, HAND_Y, true)
    this.renderBagAndDiscard(renderer, me, HAND_Y)
    this.renderDeckButton(renderer, DECK_BUTTON_CENTER)

    const hand = this.yourHand()
    for (let i = 0; i < hand.length; i++) {
      const coin = hand[i]
      const center = this.handSlotCenter(i, hand.length, HAND_Y)
      renderer.fillCircle(center, COIN_RADIUS, UNIT_DEFS[coin.unit].color)
      if (
        this.selection?.kind === 'hand' &&
        this.selection.coinId === coin.id
      ) {
        const ctx = renderer.context
        ctx.strokeStyle = PALETTE.legalStroke
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(center.x, center.y, COIN_RADIUS + 4, 0, Math.PI * 2)
        ctx.stroke()
      }
      renderer.drawText(UNIT_DEFS[coin.unit].letter, center, {
        color: '#f5f2ef',
        font: 'bold 15px sans-serif',
        align: 'center',
        baseline: 'middle',
      })
    }
  }

  private renderSupply(
    renderer: Renderer,
    player: PlayerState,
    y: number,
    isYou: boolean
  ): void {
    const units = player.units ?? []
    renderer.drawText(
      isYou ? 'резерв (рекрут: R)' : 'резерв',
      { x: SUPPLY_SLOT_X - 8, y: y - SUPPLY_SLOT_RADIUS - 14 },
      { color: PALETTE.text, font: '11px sans-serif' }
    )
    for (let i = 0; i < units.length; i++) {
      const unit = units[i]
      const count = player.supply.filter(coin => coin.unit === unit).length
      const center = this.supplySlotCenter(i, y)
      renderer.fillCircle(
        center,
        SUPPLY_SLOT_RADIUS,
        count > 0 ? UNIT_DEFS[unit].color : PALETTE.coinBack
      )
      renderer.drawText(UNIT_DEFS[unit].letter, center, {
        color: '#f5f2ef',
        font: 'bold 12px sans-serif',
        align: 'center',
        baseline: 'middle',
      })
      renderer.drawText(
        String(count),
        { x: center.x, y: center.y + SUPPLY_SLOT_RADIUS + 10 },
        {
          color: PALETTE.text,
          font: '11px sans-serif',
          align: 'center',
          baseline: 'middle',
        }
      )
    }
    this.renderRoyalIndicator(renderer, player, y, isYou)
  }

  private renderRoyalIndicator(
    renderer: Renderer,
    player: PlayerState,
    y: number,
    isYou: boolean
  ): void {
    const center = this.supplySlotCenter((player.units ?? []).length, y)
    const inHand = player.hand.some(coin => coin.unit === ROYAL)
    renderer.fillCircle(
      center,
      SUPPLY_SLOT_RADIUS,
      inHand || !isYou ? UNIT_DEFS[ROYAL].color : PALETTE.coinBack
    )
    renderer.drawText(UNIT_DEFS[ROYAL].letter, center, {
      color: '#f5f2ef',
      font: 'bold 12px sans-serif',
      align: 'center',
      baseline: 'middle',
    })
    if (isYou) {
      const zone = inHand
        ? 'в руке'
        : player.bag.some(coin => coin.unit === ROYAL)
          ? 'в мешке'
          : player.discard.some(coin => coin.unit === ROYAL)
            ? 'в сбросе'
            : 'нет'
      renderer.drawText(
        zone,
        { x: center.x, y: center.y + SUPPLY_SLOT_RADIUS + 10 },
        {
          color: PALETTE.text,
          font: '10px sans-serif',
          align: 'center',
          baseline: 'middle',
        }
      )
    }
  }

  private renderBagAndDiscard(
    renderer: Renderer,
    player: { bag: Coin[]; discard: Coin[] },
    y: number
  ): void {
    const bagCenter = { x: SIDE_PANEL_X, y }
    renderer.fillCircle(bagCenter, COIN_RADIUS - 4, PALETTE.bag)
    renderer.drawText(String(player.bag.length), bagCenter, {
      color: '#f5f2ef',
      font: 'bold 14px sans-serif',
      align: 'center',
      baseline: 'middle',
    })
    renderer.drawText(
      'мешок',
      { x: SIDE_PANEL_X, y: y - COIN_RADIUS - 22 },
      {
        color: PALETTE.text,
        font: '11px sans-serif',
        align: 'center',
      }
    )
    renderer.drawText(
      '→ рука',
      { x: SIDE_PANEL_X, y: y - COIN_RADIUS - 10 },
      {
        color: PALETTE.text,
        font: '10px sans-serif',
        align: 'center',
      }
    )

    const discardX = SIDE_PANEL_X + 56
    const discardCenter = { x: discardX, y }
    renderer.fillCircle(discardCenter, COIN_RADIUS - 4, PALETTE.coinBack)
    renderer.drawText(String(player.discard.length), discardCenter, {
      color: '#f5f2ef',
      font: 'bold 14px sans-serif',
      align: 'center',
      baseline: 'middle',
    })
    renderer.drawText(
      'сброс',
      { x: discardX, y: y - COIN_RADIUS - 22 },
      {
        color: PALETTE.text,
        font: '11px sans-serif',
        align: 'center',
      }
    )
    renderer.drawText(
      '→ мешок',
      { x: discardX, y: y - COIN_RADIUS - 10 },
      {
        color: PALETTE.text,
        font: '10px sans-serif',
        align: 'center',
      }
    )
  }

  private renderDeckButton(renderer: Renderer, center: Vector2): void {
    renderer.fillCircle(center, DECK_BUTTON_RADIUS, PALETTE.bag)
    const ctx = renderer.context
    ctx.strokeStyle = '#f5f2ef'
    ctx.lineWidth = 2
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath()
      ctx.moveTo(center.x - 6, center.y + i * 4)
      ctx.lineTo(center.x + 6, center.y + i * 4)
      ctx.stroke()
    }
    renderer.drawText(
      'колода',
      { x: center.x, y: center.y - DECK_BUTTON_RADIUS - 8 },
      {
        color: PALETTE.text,
        font: '10px sans-serif',
        align: 'center',
        baseline: 'middle',
      }
    )
  }

  private deckLayout(viewed: PlayerIndex) {
    const units = this.state?.players[viewed].units ?? []
    const width = units.length * CARD_WIDTH + (units.length + 1) * CARD_GAP
    const height = CARD_HEIGHT + 110
    const x = 400 - width / 2
    const y = 300 - height / 2
    return {
      x,
      y,
      width,
      height,
      cards: units.map((unit, index) => ({
        unit,
        x: x + CARD_GAP + index * (CARD_WIDTH + CARD_GAP),
        y: y + 70,
      })),
      close: {
        center: { x: x + width - 22, y: y + 22 },
        radius: 12,
      },
    }
  }

  private countCoinsOf(unit: UnitId, owner: PlayerIndex): number {
    if (!this.state) {
      return 0
    }
    const player = this.state.players[owner]
    let count = [
      ...player.hand,
      ...player.bag,
      ...player.discard,
      ...player.supply,
    ].filter(coin => coin.unit === unit).length
    for (const cell of Object.values(this.state.board)) {
      if (cell.unit && cell.unit.owner === owner) {
        count += cell.unit.coins.filter(coin => coin.unit === unit).length
      }
    }
    return count
  }

  private countPublicCoinsOf(
    unit: UnitId,
    owner: PlayerIndex
  ): { board: number; supply: number } {
    const player = this.state?.players[owner]
    const supply = player
      ? player.supply.filter(coin => coin.unit === unit).length
      : 0
    let board = 0
    for (const cell of Object.values(this.state?.board ?? {})) {
      if (cell.unit && cell.unit.owner === owner) {
        board += cell.unit.coins.filter(coin => coin.unit === unit).length
      }
    }
    return { board, supply }
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const lines: string[] = []
    let line = ''
    for (const word of text.split(' ')) {
      const candidate = line ? `${line} ${word}` : word
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    }
    if (line) {
      lines.push(line)
    }
    return lines
  }

  private drawUnitPortrait(
    renderer: Renderer,
    unit: UnitId,
    center: Vector2,
    radius: number
  ): void {
    // Заглушка вместо арта: монета с буквой. Когда появятся картинки —
    // заменить здесь на renderer.drawImage со спрайтом юнита.
    const def = UNIT_DEFS[unit]
    renderer.fillCircle(center, radius, def.color)
    renderer.drawText(def.letter, center, {
      color: '#f5f2ef',
      font: 'bold 26px sans-serif',
      align: 'center',
      baseline: 'middle',
    })
  }

  private renderUnitCard(
    renderer: Renderer,
    card: { unit: UnitId; x: number; y: number },
    viewed: PlayerIndex
  ): void {
    const def = UNIT_DEFS[card.unit]
    const centerX = card.x + CARD_WIDTH / 2
    renderer.fillRect(
      { x: card.x, y: card.y, width: CARD_WIDTH, height: CARD_HEIGHT },
      PALETTE.hexFill
    )
    renderer.strokeRect(
      { x: card.x, y: card.y, width: CARD_WIDTH, height: CARD_HEIGHT },
      def.color,
      2
    )
    renderer.drawText(
      def.name,
      { x: centerX, y: card.y + 18 },
      {
        color: PALETTE.text,
        font: 'bold 13px sans-serif',
        align: 'center',
        baseline: 'middle',
      }
    )
    this.drawUnitPortrait(
      renderer,
      card.unit,
      { x: centerX, y: card.y + 62 },
      30
    )
    const countLabel =
      viewed === this.you
        ? `монет: ${this.countCoinsOf(card.unit, viewed)}/${COINS_PER_UNIT_TOTAL}`
        : (() => {
            const { board, supply } = this.countPublicCoinsOf(card.unit, viewed)
            return `на поле: ${board} · в резерве: ${supply}`
          })()
    renderer.drawText(
      countLabel,
      { x: centerX, y: card.y + 106 },
      {
        color: PALETTE.text,
        font: '10px sans-serif',
        align: 'center',
        baseline: 'middle',
      }
    )
    const tactic = getTactic(card.unit)
    if (!tactic) {
      return
    }
    const ctx = renderer.context
    const kindLabel = tactic.kind === 'passive' ? ' · пассивная' : ''
    ctx.font = 'bold 11px sans-serif'
    const nameLines = this.wrapText(
      ctx,
      `«${tactic.name}»${kindLabel}`,
      CARD_WIDTH - 16
    )
    nameLines.forEach((line, index) =>
      renderer.drawText(
        line,
        { x: centerX, y: card.y + 124 + index * 13 },
        {
          color: PALETTE.tacticStroke,
          font: 'bold 11px sans-serif',
          align: 'center',
          baseline: 'middle',
        }
      )
    )
    const descTop = card.y + 124 + nameLines.length * 13 + 4
    const maxLines = Math.max(
      1,
      Math.floor((card.y + CARD_HEIGHT - 10 - descTop) / 12)
    )
    ctx.font = '10px sans-serif'
    const lines = this.wrapText(ctx, tactic.description, CARD_WIDTH - 16)
    const clipped = lines.slice(0, maxLines)
    if (lines.length > maxLines) {
      clipped[clipped.length - 1] += '…'
    }
    clipped.forEach((line, index) =>
      renderer.drawText(
        line,
        { x: centerX, y: descTop + 6 + index * 12 },
        {
          color: PALETTE.text,
          font: '10px sans-serif',
          align: 'center',
          baseline: 'middle',
        }
      )
    )
  }

  private renderDeckModal(renderer: Renderer): void {
    if (this.deckView === null || !this.state) {
      return
    }
    const viewed = this.deckView
    const ctx = renderer.context
    ctx.fillStyle = 'rgba(40, 30, 20, 0.5)'
    ctx.fillRect(0, 0, renderer.width, renderer.height)
    const layout = this.deckLayout(viewed)
    const panel = {
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
    }
    renderer.fillRect(panel, '#fcf5e5')
    renderer.strokeRect(panel, PALETTE.hexStroke, 2)
    renderer.drawText(
      viewed === this.you ? 'Ваша колода' : 'Колода противника',
      { x: 400, y: layout.y + 28 },
      {
        color: PALETTE.text,
        font: 'bold 16px sans-serif',
        align: 'center',
        baseline: 'middle',
      }
    )
    renderer.fillCircle(
      layout.close.center,
      layout.close.radius,
      PALETTE.attackStroke
    )
    renderer.drawText('×', layout.close.center, {
      color: '#f5f2ef',
      font: 'bold 14px sans-serif',
      align: 'center',
      baseline: 'middle',
    })
    for (const card of layout.cards) {
      this.renderUnitCard(renderer, card, viewed)
    }
  }

  private renderHints(renderer: Renderer): void {
    if (!this.isYourTurn) {
      this.drawHint(renderer, 'Ход противника…')
      return
    }
    if (!this.selection) {
      this.drawHint(
        renderer,
        'Ваш ход: выберите монету в руке или своего юнита. P — пас, I — инициатива, R — рекрут'
      )
      return
    }
    if (this.selection.kind === 'hand') {
      this.drawHint(
        renderer,
        'Клик по подсвеченной клетке — действие, по резерву — рекрут. P — пас, I — инициатива, R — рекрут, Esc — отмена'
      )
      return
    }
    const unitCell = this.state?.board[hexKey(this.selection.at)]
    const unitType = unitCell?.unit?.coins[0]?.unit
    const hasCoin =
      unitType !== undefined &&
      this.yourHand().some(coin => coin.unit === unitType)
    if (unitType && !hasCoin) {
      this.drawHint(
        renderer,
        `Нет монеты «${UNIT_DEFS[unitType].name}» в руке — юнит не может действовать. P — пас, Esc — отмена`
      )
      return
    }
    this.drawHint(
      renderer,
      'Жёлтое — ход, красное — атака, фиолетовое — тактика. Кнопки в клетке: З — захват, А — атака, Т — тактика. Esc — отмена'
    )
  }

  private drawHint(renderer: Renderer, line: string): void {
    renderer.drawText(
      line,
      { x: 400, y: 592 },
      {
        color: PALETTE.text,
        font: '11px sans-serif',
        align: 'center',
        baseline: 'middle',
      }
    )
  }

  private startAnimations(prev: MatchState, next: MatchState): void {
    const prevPositions = new Map<number, Vector2>()
    for (const cell of Object.values(prev.board)) {
      if (cell.unit) {
        const top = cell.unit.coins[cell.unit.coins.length - 1]
        prevPositions.set(
          top.id,
          this.grid.coordToPixel(this.toView(cell.coord))
        )
      }
    }
    for (const cell of Object.values(next.board)) {
      if (!cell.unit) {
        continue
      }
      const top = cell.unit.coins[cell.unit.coins.length - 1]
      const from = prevPositions.get(top.id)
      const to = this.grid.coordToPixel(this.toView(cell.coord))
      if (from && distance(from, to) > 1) {
        this.animations.set(top.id, from)
        this.tweens.add(
          new Tween({
            from: 0,
            to: 1,
            duration: 0.3,
            easing: Easings.easeOutCubic,
            onUpdate: value => {
              this.animations.set(top.id, lerp(from, to, value))
            },
            onComplete: () => {
              this.animations.delete(top.id)
            },
          })
        )
      }
    }
  }
}
