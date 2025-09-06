import type { CommissionState } from "./enums"


export type DatabaseTypeV2 = {
    definitions: DefinitionsType
    members: MemberTypeV3[]
    events: EventsTypeV2
    auditLog: AuditLogTypeV2[]
}



export const DEFINITIONS_DEFAULT_ID = 'default'

export type DefinitionsType = {
    id: 'default'
    guild: string
}



export type MemberTypeV3 = {
    id: string
    name: string
    power: number
} & MemberCommissionType & MemberEventType

export type MemberCommissionType = {
    state: CommissionState
    time: number
    missed: number
}

export type MemberEventType = {
    worldTree: string
    minesInDungeon: string
    cloudKingdom: string
    cassinoOnYacht: string
}



export type TeamTypeV2 = {
    id: string
    name: string
    count: number
    size: number
}

export type EventsTypeV2 = {
    worldTree: TeamTypeV2[]
    minesInDungeon: TeamTypeV2[]
    cloudKingdom: TeamTypeV2[]
    cassinoOnYacht: TeamTypeV2[]
}

export type AuditLogTypeV2 = {
    /**
     * Nome do usuário que fez que gerou o AuditLog. Usado apenas na implementação para Vercel
     */
    user?: string

    unixTime: number
    action: string
    details: AuditLogDetailsV2
}

export type AuditLogDetailsV2 = {
    name?: string
    power?: number

    gameEvent?: string
    teamName?: string
    memberId?: string

    oldName?: string
    newName?: string

    state?: number
}



export const DATA_STRUCTURE_TEMPLATE: DatabaseTypeV2 = {
    definitions: {
        id: DEFINITIONS_DEFAULT_ID,
        guild: 'Guild Name 🎈'
    },
    members: [],
    events: {
        worldTree: [],
        minesInDungeon: [],
        cloudKingdom: [],
        cassinoOnYacht: []
    },
    auditLog: []
}
