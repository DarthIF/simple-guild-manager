import type { Actions, CommissionState, GameEvents, Role } from "./enums"



export const DEFINITIONS_DEFAULT_ID = 'default'

export const UNDEFINED_TEAM = '@undefined_team'

export const DATA_STRUCTURE_TEMPLATE: DatabaseJsonType = {
    version: 1,
    userAgent: '💻',
    definitions: {
        id: DEFINITIONS_DEFAULT_ID,
        guild: 'Guild Name 🎈',
        maxMembers: 30
    },
    members: [],
    events: [],
    auditLog: []
}



export function validateDatabase(data: Partial<DatabaseTypeV3>): boolean {
    const step_1 = data
        && typeof data.definitions === 'object'
        && typeof data.definitions.id === 'string'
        && typeof data.definitions.guild === 'string'
        && typeof data.definitions.maxMembers === 'number'
        && typeof data.members === 'object'
        && typeof data.events === 'object'
        && typeof data.auditLog === 'object'
        && Array.isArray(data.members)
        && Array.isArray(data.events)
        && Array.isArray(data.auditLog)

    if (!step_1)
        return false

    // @ts-ignore
    for (const m of data.members) {
        if (validateMemberTypeV3(m) !== true)
            return false
    }

    //@ts-ignore
    for (const t of data.events) {
        if (validateEventTeamType(t) !== true)
            return false
    }

    return true
}

export function validadeDatabaseJson(data: Partial<DatabaseJsonType>): boolean {
    return validateDatabase(data) && typeof data.version === 'number'
}

export function validateMemberTypeV3(member: Partial<MemberTypeV3>): boolean {
    return member
        && typeof member.id === 'string'
        && typeof member.name === 'string'
        && typeof member.power === 'number'
        && typeof member.role === 'number'
        && typeof member.offline === 'number'
        && typeof member.state === 'number'
        && typeof member.time === 'number'
        && typeof member.missed === 'number'
        && typeof member.worldTree === 'string'
        && typeof member.minesInDungeon === 'string'
        && typeof member.cloudKingdom === 'string'
        && typeof member.cassinoOnYacht === 'string'
        && typeof member.infernoRally === 'string'
}

export function validateEventTeamType(team: Partial<EventTeamType>) {
    return team
        && typeof team.event === 'string'
        && typeof team.id === 'string'
        && typeof team.name === 'string'
        && typeof team.count === 'number'
        && typeof team.size === 'number'
}



export type DatabaseTypeV3 = {
    definitions: DefinitionsType
    members: MemberTypeV3[]
    events: EventTeamType[]
    auditLog: AuditLogTypeV3[]
}

export type DatabaseJsonType = {
    /**
     * Versão do arquivo de backup
     */
    version: number
    /**
     * Navegador que gerou o arquivo de backup
     */
    userAgent: string
} & DatabaseTypeV3



export type DefinitionsType = {
    /**
     * O valor deverá ser sempre {@link DEFINITIONS_DEFAULT_ID}
     */
    id: 'default'

    /**
     * Nome da guilda
     */
    guild: string

    /**
     * Máximo de membros que a guilda pode ter
     */
    maxMembers: number
}



export type MemberTypeV3 = {
    /**
     * Id único do membro
     */
    id: string

    /**
     * Servidor do jogador
     */
    server: number

    /**
     * Nome de jogador do membro
     */
    name: string

    /**
     * Ganhos do jogador
     */
    earnings: number

    /**
     * Poder do jogador
     */
    power: number

    /**
     * Cargo do jogador na guilda
     */
    role: Role

    /**
     * Dias que o jogador ficou offline
     */
    offline: number
} & MemberCommissionType & MemberEventType

export type MemberCommissionType = {
    /**
     * Define em qual lista de comissão o membro está
     */
    state: CommissionState

    /**
     * Quando o jogador foi incluído na lista atual
     */
    time: number

    /**
     * Quantas vezes o jogador perdeu a comissão
     */
    missed: number
}

export type MemberEventType = {
    /**
     * ID do time que o membro está no evento {@link GameEvents.WORLD_TREE}.
     * Se não estiver em um time o valor poderá ser uma string em branco ou {@link UNDEFINED_TEAM}
     */
    worldTree: string

    /**
     * ID do time que o membro está no evento {@link GameEvents.MINES_IN_DUNGEON}.
     * Se não estiver em um time o valor poderá ser uma string em branco ou {@link UNDEFINED_TEAM}
     */
    minesInDungeon: string

    /**
     * ID do time que o membro está no evento {@link GameEvents.CLOUD_KINGDOM}.
     * Se não estiver em um time o valor poderá ser uma string em branco ou {@link UNDEFINED_TEAM}
     */

    cloudKingdom: string

    /**
     * ID do time que o membro está no evento {@link GameEvents.CASSINO_ON_YACHT}.
     * Se não estiver em um time o valor poderá ser uma string em branco ou {@link UNDEFINED_TEAM}
     */
    cassinoOnYacht: string

    /**
     * ID do time que o membro está no evento {@link GameEvents.INFERNO_RALLY}.
     * Se não estiver em um time o valor poderá ser uma string em branco ou {@link UNDEFINED_TEAM}
     */
    infernoRally: string
}

export type MemberGuildType = {
    guild: string
    tag: string
}



export type EventTeamType = {
    /**
     * Evento em que essa equipe está
     */
    event: GameEvents

    /**
     * Id único da equipe
     */
    id: string

    /**
     * Nome da equipe
     */
    name: string

    /**
     * Quantidade de membros nessa equipe
     */
    count: number

    /**
     * Tamanho limite da equipe
     */
    size: number
}



export type AuditLogTypeV3 = {
    /**
     * Nome do usuário que fez que gerou o AuditLog.
     * Usado apenas na implementação para o Vercel.
     */
    user?: string

    unixTime: number
    action: Actions
    details: AuditLogDetailsV3
}


export type AuditLogDetailsV3 = {}
    & AuditLogDetails_SetGuildName
    & AuditLogDetails_AddMember
    & AuditLogDetails_DeleteMember
    & AuditLogDetails_EditMember
    & AuditLogDetails_CreateTeam
    & AuditLogDetails_DeleteTeam
    & AuditLogDetails_AddMemberToTeam
    & AuditLogDetails_RemoveMemberFromTeam
    & AuditLogDetails_SetCommissionState

type AuditLogDetails_SetGuildName = {
    oldName?: string
    newName?: string
}

type AuditLogDetails_AddMember = {
    memberId?: string
    name?: string
    power?: number
}

type AuditLogDetails_DeleteMember = {
    name?: string
}

type AuditLogDetails_EditMember = {
    memberId?: string
    oldName?: string
    oldPower?: number
    newName?: string
    newPower?: number
}

type AuditLogDetails_CreateTeam = {
    gameEvent?: string
    teamId?: string
    teamName?: string
}

type AuditLogDetails_DeleteTeam = {
    gameEvent?: string
    teamId?: string
}

type AuditLogDetails_AddMemberToTeam = {
    gameEvent?: string
    teamId?: string
    memberId?: string
}

type AuditLogDetails_RemoveMemberFromTeam = {} & AuditLogDetails_AddMemberToTeam

type AuditLogDetails_SetCommissionState = {
    memberId?: string
    state?: number
}



export type DatabaseExportOptionsType = {
    [Key in keyof DatabaseTypeV3]?: boolean
}
