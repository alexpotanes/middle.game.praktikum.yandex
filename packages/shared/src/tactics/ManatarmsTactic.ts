import type { AxialCoord } from '../hex'
import type { MatchState, PlayerIndex } from '../types'
import { UnitTactic } from './UnitTactic'
import { cellAt } from './helpers'

export class ManatarmsTactic extends UnitTactic {
  readonly unitId = 'manatarms' as const
  readonly name = 'Сплочение'
  readonly description =
    'Монета этого типа из резерва кладётся поверх стека юнита'

  activeTargets(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): AxialCoord[] {
    const hasSupply = state.players[playerIndex].supply.some(
      coin => coin.unit === this.unitId
    )
    return hasSupply ? [at] : []
  }

  applyActive(
    state: MatchState,
    playerIndex: PlayerIndex,
    at: AxialCoord
  ): void {
    const player = state.players[playerIndex]
    const index = player.supply.findIndex(coin => coin.unit === this.unitId)
    const cell = cellAt(state, at)
    if (index === -1 || !cell?.unit) {
      return
    }
    cell.unit.coins.push(player.supply.splice(index, 1)[0])
  }
}
