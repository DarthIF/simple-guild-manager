import type { CommissionState, GameEvents } from "./enums"


export type DatabaseTypeV2 = {
    definitions: DefinitionsType
    members: MemberTypeV3[]
    events: EventsTypeV2
    auditLog: AuditLogTypeV2[]
}

export type DatabaseJsonType = {
    version: number
} & DatabaseTypeV2



export type DefinitionsType = {
    /**
     * O valor deverá ser sempre {@link DEFINITIONS_DEFAULT_ID}
     */
    id: 'default'

    /**
     * Nome da guilda
     */
    guild: string
}



export type MemberTypeV3 = {
    /**
     * Id único do membro
     */
    id: string
    /**
     * Nome de jogador do membro
     */
    name: string
    /**
     * Poder do jogador
     */
    power: number
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
}



export type EventsTypeV2 = {
    /**
     * Lista de equipes para o evento {@link GameEvents.WORLD_TREE}.
     */
    worldTree: TeamTypeV2[]

    /**
     * Lista de equipes para o evento {@link GameEvents.MINES_IN_DUNGEON}.
     */
    minesInDungeon: TeamTypeV2[]

    /**
     * Lista de equipes para o evento {@link GameEvents.CLOUD_KINGDOM}.
     */
    cloudKingdom: TeamTypeV2[]

    /**
     * Lista de equipes para o evento {@link GameEvents.CASSINO_ON_YACHT}.
     */
    cassinoOnYacht: TeamTypeV2[]
}

export type TeamTypeV2 = {
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



export type AuditLogTypeV2 = {
    /**
     * Nome do usuário que fez que gerou o AuditLog. Usado apenas na implementação para o Vercel
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



export const DEFINITIONS_DEFAULT_ID = 'default'

export const UNDEFINED_TEAM = '@undefined_team'

export const DATA_STRUCTURE_TEMPLATE: DatabaseJsonType = {
    version: 1,
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
