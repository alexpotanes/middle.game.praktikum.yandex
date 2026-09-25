import type { GameAction, RuleError } from './actions'
import { hexEquals, hexKey, hexNeighbors } from './hex'
import type { AxialCoord } from './hex'
import { shuffleWithSeed } from './rng'
import { getTactic } from './tactics'
import {
  damageUnit,
  findAdjacentAttacker,
  findUnitCell,
} from './tactics/helpers'
import { otherPlayer } from './types'
import type { BoardUnit, MatchState, PlayerState } from './types'
import { HAND_SIZE, ROYAL } from './units'
import type { Coin, UnitId } from './units'

type ApplyResult = { state: MatchState } | { error: RuleError }

const err = (code: RuleError['code'], message: string): ApplyResult => ({
  error: { code, message },
})

const clone = (state: MatchState): MatchState =>
  JSON.parse(JSON.stringify(state)) as MatchState

const canAct = (player: PlayerState): boolean =>
  !player.passed && player.hand.length > 0

const unitType = (unit: BoardUnit): UnitId => unit.coins[0].unit

const findUnitOfType = (
  state: MatchState,
  owner: number,
  type: string
): BoardUnit | undefined =>
  Object.values(state.board).find(
    cell =>
      cell.unit && cell.unit.owner === owner && unitType(cell.unit) === type
  )?.unit

const playerHasCoinsAnywhere = (player: PlayerState): boolean =>
  player.hand.length +
    player.bag.length +
    player.discard.length +
    player.supply.length >
  0

const playerHasUnitsOnBoard = (state: MatchState, owner: number): boolean =>
  Object.values(state.board).some(
    cell => cell.unit && cell.unit.owner === owner
  )

const checkElimination = (state: MatchState): void => {
  for (const player of [0, 1] as const) {
    const opponent = otherPlayer(player)
    if (
      !playerHasCoinsAnywhere(state.players[player]) &&
      !playerHasUnitsOnBoard(state, player)
    ) {
      state.winner = opponent
      state.winReason = 'elimination'
      return
    }
  }
}

const endRound = (state: MatchState): void => {
  for (const player of state.players) {
    const merged = [...player.bag, ...player.discard]
    const shuffled = shuffleWithSeed(merged, state.rngState)
    state.rngState = shuffled.rngState
    player.bag = shuffled.items
    player.discard = []
    while (player.hand.length < HAND_SIZE && player.bag.length > 0) {
      player.hand.push(player.bag.pop() as Coin)
    }
    player.passed = false
  }
  state.round += 1
  state.activePlayer = state.initiative
  checkElimination(state)
}

const advanceTurn = (state: MatchState, current: number): void => {
  if (state.winner !== null) {
    return
  }
  const next = otherPlayer(current as 0 | 1)
  if (canAct(state.players[next])) {
    state.activePlayer = next
  } else if (canAct(state.players[current as 0 | 1])) {
    state.activePlayer = current as 0 | 1
  } else {
    endRound(state)
  }
}

const takeCoinFromHand = (
  player: PlayerState,
  coinId: number
): Coin | undefined => {
  const index = player.hand.findIndex(coin => coin.id === coinId)
  if (index === -1) {
    return undefined
  }
  return player.hand.splice(index, 1)[0]
}

const cellAt = (state: MatchState, coord: AxialCoord) =>
  state.board[hexKey(coord)]

const hasMovePath = (
  state: MatchState,
  from: AxialCoord,
  to: AxialCoord,
  range: number
): boolean => {
  const goal = hexKey(to)
  const visited = new Set([hexKey(from)])
  let frontier = [from]
  for (let step = 0; step < range; step++) {
    const next: AxialCoord[] = []
    for (const coord of frontier) {
      for (const neighbor of hexNeighbors(coord)) {
        const key = hexKey(neighbor)
        if (visited.has(key)) {
          continue
        }
        const cell = state.board[key]
        if (!cell || cell.unit) {
          continue
        }
        if (key === goal) {
          return true
        }
        visited.add(key)
        next.push(neighbor)
      }
    }
    frontier = next
  }
  return false
}

export const validateAction = (
  state: MatchState,
  playerIndex: number,
  action: GameAction
): RuleError | null => {
  const result = applyAction(state, playerIndex, action)
  return 'error' in result ? result.error : null
}

export const applyAction = (
  source: MatchState,
  playerIndex: number,
  action: GameAction
): ApplyResult => {
  if (source.winner !== null) {
    return err('GAME_FINISHED', 'Партия уже завершена')
  }
  if (source.activePlayer !== playerIndex) {
    return err('NOT_YOUR_TURN', 'Сейчас ход противника')
  }

  const state = clone(source)
  const player = state.players[playerIndex as 0 | 1]

  if (player.passed) {
    return err('ALREADY_PASSED', 'Вы уже спасовали в этом раунде')
  }

  const coin = player.hand.find(item => item.id === action.coinId)
  if (!coin) {
    return err('COIN_NOT_IN_HAND', 'Такой монеты нет в руке')
  }

  switch (action.type) {
    case 'deploy': {
      if (coin.unit === ROYAL) {
        return err('ILLEGAL_TARGET', 'У королевской монеты нет юнита')
      }
      const anywhere = getTactic(coin.unit)?.deployAnywhere() ?? false
      const cell = cellAt(state, action.to)
      if (
        !cell ||
        !cell.isLocation ||
        cell.unit ||
        (!anywhere && cell.control !== playerIndex)
      ) {
        return err(
          'ILLEGAL_TARGET',
          anywhere
            ? 'Развернуть можно только на пустую локацию'
            : 'Развернуть можно только на пустой локации под вашим контролем'
        )
      }
      if (findUnitOfType(state, playerIndex, coin.unit)) {
        return err(
          'UNIT_TYPE_ON_FIELD',
          'Юнит этого типа уже развёрнут на поле'
        )
      }
      cell.unit = {
        owner: playerIndex as 0 | 1,
        coins: [takeCoinFromHand(player, coin.id) as Coin],
      }
      break
    }

    case 'bolster': {
      const cell = cellAt(state, action.to)
      if (
        !cell?.unit ||
        cell.unit.owner !== playerIndex ||
        unitType(cell.unit) !== coin.unit
      ) {
        return err(
          'NO_MATCHING_UNIT',
          'Укрепить можно только своего юнита того же типа'
        )
      }
      cell.unit.coins.push(takeCoinFromHand(player, coin.id) as Coin)
      break
    }

    case 'move': {
      const from = cellAt(state, action.from)
      const to = cellAt(state, action.to)
      if (!from?.unit || from.unit.owner !== playerIndex) {
        return err('NO_MATCHING_UNIT', 'На исходной клетке нет вашего юнита')
      }
      if (unitType(from.unit) !== coin.unit) {
        return err(
          'NO_MATCHING_UNIT',
          'Сброшенная монета должна соответствовать юниту'
        )
      }
      const range = getTactic(coin.unit)?.moveRange() ?? 1
      if (
        !to ||
        to.unit ||
        !hasMovePath(state, action.from, action.to, range)
      ) {
        return err(
          'ILLEGAL_TARGET',
          range > 1
            ? `Движение до ${range} гексов по пустым клеткам`
            : 'Движение только на соседний пустой гекс'
        )
      }
      to.unit = from.unit
      delete from.unit
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      break
    }

    case 'attack': {
      if (coin.unit === ROYAL) {
        return err('NO_MATCHING_UNIT', 'Королевская монета не атакует')
      }
      const target = cellAt(state, action.target)
      if (!target?.unit || target.unit.owner === playerIndex) {
        return err('ILLEGAL_TARGET', 'На клетке нет вражеского юнита')
      }
      const attackerAdjacent = Object.values(state.board).some(
        cell =>
          cell.unit &&
          cell.unit.owner === playerIndex &&
          unitType(cell.unit) === coin.unit &&
          hexNeighbors(cell.coord).some(c => hexEquals(c, action.target))
      )
      if (!attackerAdjacent) {
        return err(
          'NO_MATCHING_UNIT',
          'Нет вашего юнита этого типа рядом с целью'
        )
      }
      const guarded = hexNeighbors(action.target).some(coord => {
        const cell = cellAt(state, coord)
        return (
          cell?.unit &&
          cell.unit.owner !== playerIndex &&
          getTactic(unitType(cell.unit))?.protectsAdjacentAllies()
        )
      })
      if (guarded) {
        return err('ILLEGAL_TARGET', 'Цель под охраной гвардейца')
      }
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      const targetType = unitType(target.unit)
      const { destroyed } = damageUnit(state, action.target)
      if (getTactic(targetType)?.counterattacks()) {
        const attacker = findAdjacentAttacker(
          state,
          playerIndex as 0 | 1,
          coin.unit,
          action.target
        )
        if (attacker) {
          damageUnit(state, attacker.coord)
        }
      }
      if (destroyed) {
        const attacker = findAdjacentAttacker(
          state,
          playerIndex as 0 | 1,
          coin.unit,
          action.target
        )
        if (attacker) {
          getTactic(coin.unit)?.onAttackKilled?.(
            state,
            playerIndex as 0 | 1,
            attacker.coord,
            action.target
          )
        }
      }
      checkElimination(state)
      break
    }

    case 'tactic': {
      if (coin.unit === ROYAL) {
        return err('NOT_IMPLEMENTED', 'У королевской монеты нет тактики')
      }
      const unitCell = findUnitCell(state, playerIndex as 0 | 1, coin.unit)
      if (!unitCell?.unit) {
        return err('NO_MATCHING_UNIT', 'Юнит этого типа не развёрнут на поле')
      }
      const tactic = getTactic(coin.unit)
      if (!tactic || tactic.kind !== 'active') {
        return err('NOT_IMPLEMENTED', 'У этого юнита нет активной тактики')
      }
      const error = tactic.validateActive(
        state,
        playerIndex as 0 | 1,
        unitCell.coord,
        action.target
      )
      if (error) {
        return { error }
      }
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      tactic.applyActive(
        state,
        playerIndex as 0 | 1,
        unitCell.coord,
        action.target
      )
      checkElimination(state)
      break
    }

    case 'control': {
      const cell = cellAt(state, action.at)
      if (
        !cell?.unit ||
        cell.unit.owner !== playerIndex ||
        unitType(cell.unit) !== coin.unit
      ) {
        return err(
          'NO_MATCHING_UNIT',
          'На локации должен стоять ваш юнит того же типа, что и монета'
        )
      }
      if (!cell.isLocation || cell.control === playerIndex) {
        return err('ILLEGAL_TARGET', 'Эту локацию нельзя захватить')
      }
      if (player.controlMarkersLeft <= 0) {
        return err('ILLEGAL_TARGET', 'Маркеры контроля закончились')
      }
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      cell.control = playerIndex as 0 | 1
      player.controlMarkersLeft -= 1
      if (player.controlMarkersLeft === 0) {
        state.winner = playerIndex as 0 | 1
        state.winReason = 'control'
      }
      break
    }

    case 'recruit': {
      if (coin.unit !== ROYAL && coin.unit !== action.unitId) {
        return err(
          'ILLEGAL_TARGET',
          'Можно рекрутировать только юнита типа сброшенной монеты'
        )
      }
      if (action.unitId === ROYAL) {
        return err('ILLEGAL_TARGET', 'Королевскую монету нельзя рекрутировать')
      }
      const supplyIndex = player.supply.findIndex(
        item => item.unit === action.unitId
      )
      if (supplyIndex === -1) {
        return err('SUPPLY_EMPTY', 'В резерве нет монет этого типа')
      }
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      player.discard.push(player.supply.splice(supplyIndex, 1)[0])
      break
    }

    case 'pass': {
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      player.passed = true
      break
    }

    case 'claimInitiative': {
      player.discard.push(takeCoinFromHand(player, coin.id) as Coin)
      state.initiative = playerIndex as 0 | 1
      break
    }
  }

  advanceTurn(state, playerIndex)
  return { state }
}
