import type { DatabaseTypeV2, MemberTypeV3, TeamTypeV2 } from './database-types'
import { GameEvents } from './enums'


export function forEachEvent(database: DatabaseTypeV2, callback: (event: GameEvents, teams: TeamTypeV2[]) => void) {
    callback(
        GameEvents.WORLD_TREE,
        database.events.worldTree)

    callback(
        GameEvents.MINES_IN_DUNGEON,
        database.events.minesInDungeon)

    callback(
        GameEvents.CLOUD_KINGDOM,
        database.events.cloudKingdom)

    callback(
        GameEvents.CASSINO_ON_YACHT,
        database.events.cassinoOnYacht)
}

export function getEventTeamsArray(database: DatabaseTypeV2, gameEvent: GameEvents): TeamTypeV2[] {
    switch (gameEvent) {
        case GameEvents.WORLD_TREE:
            return database.events.worldTree

        case GameEvents.MINES_IN_DUNGEON:
            return database.events.minesInDungeon

        case GameEvents.CLOUD_KINGDOM:
            return database.events.cloudKingdom

        case GameEvents.CASSINO_ON_YACHT:
            return database.events.cassinoOnYacht

        default:
            throw new Error('Invalid game event: ' + gameEvent)
    }
}

export function getEventTeam(database: DatabaseTypeV2, gameEvent: GameEvents, teamId: string): TeamTypeV2 | null {
    const teams = getEventTeamsArray(database, gameEvent)
    const team = teams.find(t => t.id = teamId)

    return team ? team : null
}

export function setTeamForMember(member: MemberTypeV3, gameEvent: GameEvents, teamId: string): void {
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


export function findMemberIndex(database: DatabaseTypeV2, memberId: string) {
    return database.members.findIndex(member => member.id === memberId)
}

export function findMember(database: DatabaseTypeV2, memberId: string) {
    return database.members.find(member => member.id === memberId)
}