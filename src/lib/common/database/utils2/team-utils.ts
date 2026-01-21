import { formatNumberCompact } from '$lib/utils/number-util'
import type { NullableU } from '$lib/utils/types'
import { UNDEFINED_TEAM, type DatabaseTypeV3, type EventTeamType, type MemberTypeV3 } from '../constants-and-types'
import { GameEvents } from '../enums'


export function get(database: DatabaseTypeV3, gameEvent: GameEvents, teamId: string): EventTeamType | null {
    const team = database.events.find(t => t.event === gameEvent && t.id === teamId)

    return team ? team : null
}

/**
 * Retorna uma **NOVA** array com os times que existem para determinado evento
 * 
 * @param database Banco de dados reativo
 * @param gameEvent Evento do jogo
 * @returns **Nova** array com os times do evento
 */
export function getAll(database: DatabaseTypeV3, gameEvent: GameEvents): EventTeamType[] {
    return database.events.filter(t => t.event === gameEvent)
}

export function findIndex(database: DatabaseTypeV3, gameEvent: GameEvents, teamId: string) {
    return database.events.findIndex(t => t.event === gameEvent && t.id === teamId)
}


export async function forEach(callback: (event: GameEvents) => Promise<void>) {
    await callback(GameEvents.WORLD_TREE)
    await callback(GameEvents.MINES_IN_DUNGEON)
    await callback(GameEvents.CLOUD_KINGDOM)
    await callback(GameEvents.CASSINO_ON_YACHT)
}

export function forEachSync(callback: (event: GameEvents) => void) {
    callback(GameEvents.WORLD_TREE)
    callback(GameEvents.MINES_IN_DUNGEON)
    callback(GameEvents.CLOUD_KINGDOM)
    callback(GameEvents.CASSINO_ON_YACHT)
}


export function isUndefinedID(teamId: string | null | undefined): boolean {
    return teamId === null
        || teamId === undefined
        || teamId === ''
        || teamId === UNDEFINED_TEAM
}

export function getMemberTeamId(member: MemberTypeV3 | null | undefined, gameEvent: GameEvents): string {
    if (!member)
        return UNDEFINED_TEAM

    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return member.worldTree
        case GameEvents.MINES_IN_DUNGEON:
            return member.minesInDungeon
        case GameEvents.CLOUD_KINGDOM:
            return member.cloudKingdom
        case GameEvents.CASSINO_ON_YACHT:
            return member.cassinoOnYacht
        default:
            return UNDEFINED_TEAM
    }
}

export function getMemberTeam(database: DatabaseTypeV3, member: MemberTypeV3, gameEvent: GameEvents): EventTeamType | null {
    const teamId = getMemberTeamId(member, gameEvent)
    if (isUndefinedID(teamId))
        return null

    return get(database, gameEvent, teamId)
}

export function setMemberTeamId(member: MemberTypeV3, gameEvent: GameEvents, teamId: string): void {
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            member.worldTree = teamId
            return

        case GameEvents.MINES_IN_DUNGEON:
            member.minesInDungeon = teamId
            return

        case GameEvents.CLOUD_KINGDOM:
            member.cloudKingdom = teamId
            return

        case GameEvents.CASSINO_ON_YACHT:
            member.cassinoOnYacht = teamId
            return

        default:
            throw new Error('Evento invalido: ' + gameEvent)
    }
}

export function isMemberLeaderOf(member: MemberTypeV3, team: EventTeamType): boolean {
    if (!team.leader)
        return false

    return team.leader === member.id
}


export function getMembersOfTeam(database: DatabaseTypeV3, gameEvent: GameEvents, teamId: string): MemberTypeV3[] {
    return database.members.filter(member => {
        const memberTeam = getMemberTeamId(member, gameEvent)
        return memberTeam && memberTeam === teamId
    })
}


/**
 * Aumenta ou diminui a quantidade de membros do time
 * 
 * @param team equipe a ser alterada
 * @param change valor a ser diminuído ou acrescentado
 * @returns 
 */
export function modifyCount(team: EventTeamType | null, change: number): boolean {
    if (!team)
        return false

    team.count += change

    return true
}

export function modifyCountOfMemberTeam(database: DatabaseTypeV3, member: MemberTypeV3, gameEvent: GameEvents, change: number) {
    const team = getMemberTeam(database, member, gameEvent)
    return modifyCount(team, change)
}


export function getGameEventFromString(str: string | null | undefined): GameEvents | null {
    switch (str) {
        case GameEvents.WORLD_TREE:
            return GameEvents.WORLD_TREE
        case GameEvents.MINES_IN_DUNGEON:
            return GameEvents.MINES_IN_DUNGEON
        case GameEvents.CLOUD_KINGDOM:
            return GameEvents.CLOUD_KINGDOM
        case GameEvents.CASSINO_ON_YACHT:
            return GameEvents.CASSINO_ON_YACHT
        default:
            return null
    }
}

/**
 * Retorna a KEY para um evento do jogo, para um objeto do tipo {@link MemberTypeV3}
 * 
 * @param gameEvent 
 * @returns 
 */
export function getGameEventObjectField(gameEvent: GameEvents): keyof MemberTypeV3 {
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return 'worldTree'

        case GameEvents.MINES_IN_DUNGEON:
            return 'minesInDungeon'

        case GameEvents.CLOUD_KINGDOM:
            return 'cloudKingdom'

        case GameEvents.CASSINO_ON_YACHT:
            return 'cassinoOnYacht'

        case GameEvents.INFERNO_RALLY:
            return 'infernoRally'

        default:
            // Isso garante que o TypeScript saiba que todos os valores GameEvents foram tratados
            const _exhaustiveCheck: never = gameEvent
            throw new Error(`Evento invalido: ${_exhaustiveCheck}`)
    }
}


export function calculatePower(database: DatabaseTypeV3, team: NullableU<EventTeamType>): number {
    if (!team)
        return 0

    let total = 0
    for (const member of database.members) {
        const teamId = getMemberTeamId(member, team.event)

        if (teamId && teamId === team.id)
            total += member.power
    }

    return total
}

export function calculatePowerCompact(database: DatabaseTypeV3, team: NullableU<EventTeamType>): string {
    if (!team)
        return '0'

    const power = calculatePower(database, team)
    return formatNumberCompact(power)
}





