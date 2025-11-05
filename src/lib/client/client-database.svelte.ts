import type { DatabaseEditor, DatabaseOperations } from '$lib/common/database/database-interfaces'
import { UNDEFINED_TEAM, type EventTeamType, type MemberTypeV3 } from '$lib/common/database/constants-and-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import { isSuccessfulResponse } from '$lib/utils/http-util'
import { findEventTeamIndex, findMemberByID, findMemberIndexByID, getEventTeam, getEventTeams, getMembers, setMemberTeamId } from '$lib/common/database/utils'
import { ReactiveDB } from './reactive-db.svelte'
import type { PacketType } from '$lib/common/packets/type'



function api(action: Actions, postContent: any): Promise<Response> {
    return fetch(`/app/mu/${action}`, {
        method: 'POST',
        body: JSON.stringify(postContent)
    })
}



class ClientDatabaseApi implements DatabaseOperations, DatabaseEditor {

    public async setGuildName(newName: string): Promise<boolean> {
        // Enviar a operação para o servidor
        const response = await api(Actions.SET_GUILD_NAME, { newName })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.setGuildName(newName)
    }



    public async addMember(name: string, power: number): Promise<MemberTypeV3 | null> {
        const response = await api(Actions.ADD_MEMBER, { name, power })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        const member: MemberTypeV3 = await response.json()
        return await ClientSync.addMember(member)
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER, { memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.deleteMember(memberId)
    }

    public async editMember(memberId: string, newName: string, newPower: number): Promise<MemberTypeV3 | null> {
        const response = await api(Actions.EDIT_MEMBER, { memberId, newName, newPower })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        return await ClientSync.editMember(memberId, newName, newPower)
    }

    public async findMember(memberId: string): Promise<MemberTypeV3 | null> {
        // Executado localmente
        const member = findMemberByID(ReactiveDB, memberId)
        return member ? member : null
    }



    public async createTeam(gameEvent: GameEvents, name: string): Promise<EventTeamType | null> {
        const response = await api(Actions.CREATE_TEAM, { gameEvent, name })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        const team: EventTeamType = await response.json()
        return await ClientSync.createTeam(team)
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const response = await api(Actions.DELETE_TEAM, { gameEvent, teamId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente 
        return await ClientSync.deleteTeam(gameEvent, teamId)
    }

    public async listTeams(gameEvent: GameEvents): Promise<EventTeamType[]> {
        return getEventTeams(ReactiveDB, gameEvent)
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER_TO_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.addMemberToTeam(gameEvent, teamId, memberId)
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.removeMemberFromTeam(gameEvent, teamId, memberId)
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
        return await ClientSync.setCommissionState(memberId, result.state, result.time)
    }

    public async resetCommissionCycle(): Promise<boolean> {
        const response = await api(Actions.COMMISSION_RESET_CYCLE, {})
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.resetCommissionCycle()
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


    public async importData(file: File): Promise<boolean> {
        console.error('MÉTODO NAO IMPLEMENTADO AINDA')
        return false
    }

    public exportData(): boolean {
        console.error('MÉTODO NAO IMPLEMENTADO AINDA')
        return false
    }


    public async downloadDatabase(): Promise<boolean> {
        return false
    }

}

class ClientSyncImpl {

    public async syncFromPacket(packet: PacketType) {
        switch (packet.action) {
            case Actions.SET_GUILD_NAME:
            case Actions.ADD_MEMBER:
            case Actions.DELETE_MEMBER:
            case Actions.EDIT_MEMBER:
            case Actions.CREATE_TEAM:
            case Actions.DELETE_TEAM:
            case Actions.ADD_MEMBER_TO_TEAM:
            case Actions.REMOVE_MEMBER_FROM_TEAM:
            case Actions.COMMISSION_SET_STATE:
            case Actions.COMMISSION_RESET_CYCLE:
            default:
                return
        }
    }



    public async setGuildName(newName: string): Promise<boolean> {
        ReactiveDB.definitions.guild = newName
        return true
    }



    public async addMember(member: MemberTypeV3): Promise<MemberTypeV3 | null> {
        ReactiveDB.members.push(member)
        return member
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const memberIndex = findMemberIndexByID(ReactiveDB, memberId)
        if (memberIndex > -1)
            ReactiveDB.members.splice(memberIndex, 1) // Remover o membro

        return true
    }

    public async editMember(memberId: string, newName: string, newPower: number): Promise<MemberTypeV3 | null> {
        const member = findMemberByID(ReactiveDB, memberId)
        if (!member)
            return null

        member.name = newName
        member.power = newPower

        return member
    }


    public async createTeam(team: EventTeamType): Promise<EventTeamType | null> {
        ReactiveDB.events.push(team)
        return team
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const index = findEventTeamIndex(ReactiveDB, gameEvent, teamId)
        if (index < 0)
            // Retornar true porque nesse contexto o time foi removido no servidor
            // porem no cliente não existia, isso realmente pode acontecer????
            return true

        // Deletar o time
        ReactiveDB.events.splice(index, 1)
        return true
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const member = findMemberByID(ReactiveDB, memberId)
        if (member)
            setMemberTeamId(member, gameEvent, teamId)

        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        if (team)
            team.count += 1

        return true
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const member = findMemberByID(ReactiveDB, memberId)
        if (member)
            setMemberTeamId(member, gameEvent, UNDEFINED_TEAM)

        const team = getEventTeam(ReactiveDB, gameEvent, teamId)
        if (team)
            team.count -= 1

        return true
    }


    public async setCommissionState(memberId: string, state: CommissionState, time: number): Promise<boolean> {
        const member = findMemberByID(ReactiveDB, memberId)
        if (member) {
            member.state = state
            member.time = time
        }

        return true
    }

    public async resetCommissionCycle(userName?: string): Promise<boolean> {
        for (const member of ReactiveDB.members) {
            member.state = CommissionState.AVAILABLE
            member.time = 0
        }

        return true
    }

}


export const ClientDatabase = new ClientDatabaseApi()

export const ClientSync = new ClientSyncImpl()

