import type { CommissionState, Role } from '../enums'



export type MemberTypeV4 = {
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

} & MemberCommissionType
    & MemberEventType
    & MemberGuildType



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
    /**
    * Tag do membro, caso seja uma string vazia utiliza a tag padrão de sua guilda
    */
    tag: string

    /**
     * Id da Guilda do jogador
     */
    guild: string
}
