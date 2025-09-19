import type { GuildDatabase } from '$lib/common/database/guild-database'
import { UNDEFINED_TEAM, type MemberTypeV3, type TeamTypeV2 } from '$lib/common/database/database-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import { isSuccessfulResponse } from '$lib/utils/http-util'
import { findMemberOf, findMemberIndex, getEventTeam, getEventTeamsArray, getMembers, setTeamForMember } from '$lib/common/database/utils'
import { ReactiveDB } from './reactive-database.svelte'



function api(action: Actions, postContent: any): Promise<Response> {
    return fetch(`/app/mu/${action}`, {
        method: 'POST',
        body: JSON.stringify(postContent)
    })
}



class ClientDatabaseImpl implements GuildDatabase {

    public async setGuildName(newName: string): Promise<boolean> {
        const response = await api(Actions.SET_GUILD_NAME, { newName })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        ReactiveDB.definitions.guild = newName
        return true
    }



    public async addMember(name: string, power: number): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER, { name, power })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const member: MemberTypeV3 = await response.json()
        ReactiveDB.members.push(member)
        return true
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER, { memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const memberIndex = findMemberIndex(ReactiveDB, memberId)
        if (memberIndex > -1)
            ReactiveDB.members.splice(memberIndex, 1) // Remover o membro

        return true
    }

    public async editMember(memberId: string, newName: string, newPower: number): Promise<boolean> {
        const response = await api(Actions.EDITED_MEMBER, { memberId, newName, newPower })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const member = findMemberOf(ReactiveDB, memberId)
        if (!member)
            return false

        member.name = newName
        member.power = newPower

        return true
    }

    public async findMember(memberId: string): Promise<MemberTypeV3 | null> {
        // Executado localmente
        const member = findMemberOf(ReactiveDB, memberId)
        return member ? member : null
    }



    public async createTeam(gameEvent: GameEvents, name: string): Promise<boolean> {
        const response = await api(Actions.CREATE_TEAM, { gameEvent, name })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const team: TeamTypeV2 = await response.json()
        const teams = getEventTeamsArray(ReactiveDB, gameEvent)

        // Adicionar o time
        teams.push(team)

        return true
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const response = await api(Actions.DELETE_TEAM, { gameEvent, teamId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const teams = getEventTeamsArray(ReactiveDB, gameEvent)
        const index = teams.findIndex(team => team.id === teamId)

        if (index < 0)
            // Retornar true porque nesse contexto o time foi removido no servidor
            // porem no cliente não existia, isso realmente pode acontecer?
            return true

        // Deletar o time
        teams.splice(index, 1)

        return true
    }

    public async listTeams(gameEvent: GameEvents): Promise<TeamTypeV2[]> {
        return [...getEventTeamsArray(ReactiveDB, gameEvent)]
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER_TO_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const member = findMemberOf(ReactiveDB, memberId)
        if (member)
            setTeamForMember(member, gameEvent, teamId)

        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        if (team)
            team.count += 1

        return true
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const member = findMemberOf(ReactiveDB, memberId)
        if (member)
            setTeamForMember(member, gameEvent, UNDEFINED_TEAM)

        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        if (team)
            team.count -= 1

        return true
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        const response = await api(Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT, { gameEvent })
        if (!isSuccessfulResponse(response))
            return []

        // Não deixar a informação salva em cache, o servidor irá 
        // retornar uma array com os ids dos membros
        const membersIDS: string[] = await response.json()
        return getMembers(ReactiveDB, ...membersIDS)
    }



    public async setCommissionState(memberId: string, state: CommissionState, updateTime: boolean): Promise<boolean> {
        const response = await api(Actions.COMMISSION_SET_STATE, { state, updateTime })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const result: MemberTypeV3 = await response.json()
        const member = findMemberOf(ReactiveDB, memberId)
        if (member) {
            member.state = result.state
            member.time = result.time
        }

        return true
    }

    public async resetCommissionCycle(): Promise<boolean> {
        const response = await api(Actions.COMMISSION_RESET_CYCLE, {})
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        for (const member of ReactiveDB.members) {
            member.state = CommissionState.AVAILABLE
            member.time = 0
        }

        return true
    }

    public async listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        const response = await api(Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS, { state })
        if (!isSuccessfulResponse(response))
            return []

        // Não deixar a informação salva em cache, o servidor irá 
        // retornar uma array com os ids dos membros
        const membersIDS: string[] = await response.json()
        return getMembers(ReactiveDB, ...membersIDS)
    }


}

export const ClientDatabase = new ClientDatabaseImpl()