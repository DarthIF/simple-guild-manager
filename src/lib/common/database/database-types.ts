import type { CommissionState } from './guild-database'


export type DatabaseType = {
    organization: string
    members: MemberType[]
    events: EventsType
    auditLog: AuditLogType[]
}

export type MemberType = {
    id: string
    name: string
    power: number
    commissions: {
        state: CommissionState
        time: number
        missed: number
    }
}

export type TeamType = {
    id: string
    name: string
    members: string[]
}

export type EventsType = {
    worldTree: TeamType[]
    minesInDungeon: TeamType[]
    cloudKingdom: TeamType[]
    cassinoOnYacht: TeamType[]
}

export type CommissionsType = {
    closed: string[]
    inactive: string[]
}

export type AuditLogType = {
    /**
     * Nome do usuário que fez que gerou o AuditLog. Usado apenas no Vercel
     */
    user?: string

    timestamp: string
    action: string
    details: AuditLogDetails
}

export type AuditLogDetails = {
    name?: string
    power?: number

    gameEvent?: string
    teamName?: string
    memberId?: string

    oldName?: string
    newName?: string

    state?: number
}