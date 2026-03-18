import type { DatabaseJsonTypeV4 } from './database-types'
import type { MemberTypeV4 } from './member-types'
import { CommissionState, Role } from '../enums'


export const DEFINITIONS_DEFAULT_ID = 'default'

export const UNDEFINED_TEAM = '@undefined_team'

export const DATABASE_STRUCTURE_TEMPLATE: DatabaseJsonTypeV4 = {
    version: 2,
    userAgent: '💻',

    manifest: {
        id: DEFINITIONS_DEFAULT_ID,
        name: 'Guild Name 🎈',
    },

    guilds: [],
    members: [],
    events: [],
    auditLog: []
}

export const MEMBER_STRUCTURE_TEMPLATE: MemberTypeV4 = {
    id: '',
    server: 0,
    name: '',
    earnings: 0,
    power: 0,
    role: Role.MEMBER,
    offline: 0,

    state: CommissionState.AVAILABLE,
    time: 0,
    missed: 0,

    worldTree: '',
    minesInDungeon: '',
    cloudKingdom: '',
    cassinoOnYacht: '',
    infernoRally: '',

    tag: '',
    guild: '',
}
