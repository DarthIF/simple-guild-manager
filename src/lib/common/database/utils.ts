import { UNDEFINED_TEAM, type DatabaseTypeV2, type MemberTypeV3, type TeamTypeV2 } from './database-types'
import { GameEvents } from './enums'


type FindMemberAndIndexType = {
    index: number
    member: MemberTypeV3
}



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




export function isUndefinedTeamID(teamId: string | null | undefined): boolean {
    return teamId === null
        && teamId === undefined
        && teamId === ''
        && teamId === UNDEFINED_TEAM
}

export function hasTeamForEvent(member: MemberTypeV3, gameEvent: GameEvents): boolean {
    const teamId = getTeamIdOfMember(member, gameEvent)
    return !isUndefinedTeamID(teamId)
}

export function getTeamIdOfMember(member: MemberTypeV3, gameEvent: GameEvents): string | null {
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
            return null
    }
}

export function getTeamOfMember(database: DatabaseTypeV2, member: MemberTypeV3, gameEvent: GameEvents): TeamTypeV2 | null {
    const teamId = getTeamIdOfMember(member, gameEvent)
    if (isUndefinedTeamID(teamId))
        return null

    // @ts-ignore
    // O null já é verificado em isUndefinedTeamID()
    return getEventTeam(database, gameEvent, teamId)
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




export function findMemberByID(database: DatabaseTypeV2, memberId: string) {
    return database.members.find(member => member.id === memberId)
}

export function findMemberIndexByID(database: DatabaseTypeV2, memberId: string) {
    return database.members.findIndex(member => member.id === memberId)
}

export function findMemberAndIndex(database: DatabaseTypeV2, memberId: string): FindMemberAndIndexType | null {
    const index = findMemberIndexByID(database, memberId)
    if (index < 0)
        return null

    return {
        index,
        member: database.members[index]
    }
}

export function getMembers(database: DatabaseTypeV2, ...ids: string[]) {
    const result: MemberTypeV3[] = []
    for (const member of database.members) {
        for (const id of ids) {
            if (member.id === id)
                result.push(member)
        }
    }

    return result
}




export function changeMemberCount(team: TeamTypeV2 | null, change: number): boolean {
    if (!team)
        return false

    team.count += change
    return true
}