import type { GameEvents } from '../enums'


export type EventTeamTypeV1 = {
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

    /**
     * ID do líder da equipe, se houver
     */
    leader?: string
}
