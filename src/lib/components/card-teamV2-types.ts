import type { EventTeamType } from '$lib/common/database/constants-and-types'
import type { GameEvents } from '$lib/common/database/enums'

export type CardTeamCallback = (gameEvent: GameEvents, team: EventTeamType) => void 