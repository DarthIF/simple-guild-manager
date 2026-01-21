import type { DatabaseEditor, DatabaseOperationResult_SetCommissionState, DatabaseOperations } from '$lib/common/database/database-interfaces'
import type { PacketType } from '$lib/common/packets/type'
import type { PostAddMemberToTeamType, PostDeleteMemberType, PostDeleteTeamType, PostEditMemberType, PostRemoveMemberFromTeamType, PostResetCommissionCycleType, PostSetCommissionSateType, PostSetGuildNameType, ResponseAddMemberType, ResponseCreateTeamType, ResponseEditMemberType, ResponseSetCommissionSateType } from '$lib/common/database/post-types'
import { UNDEFINED_TEAM, validateEventTeamType, validateMemberTypeV3, type DatabaseTypeV3, type EventTeamType, type MemberTypeV3 } from '$lib/common/database/constants-and-types'
import { Actions, CommissionState, GameEvents } from '$lib/common/database/enums'
import { isSuccessfulResponse } from '$lib/utils/http-util'
import { ReactiveDB } from './reactive-db.svelte'
import { MemberUtils, TeamUtils } from '$lib/common/database/utils2'



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
        const data = await response.json()
        return await ClientSync.setGuildName(data)
    }



    public async addMember(name: string, power: number): Promise<MemberTypeV3 | null> {
        const response = await api(Actions.ADD_MEMBER, { name, power })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        const member: ResponseAddMemberType = await response.json()
        return await ClientSync.addMember(member)
    }

    public async deleteMember(memberId: string): Promise<boolean> {
        const response = await api(Actions.DELETE_MEMBER, { memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const data = await response.json()
        return await ClientSync.deleteMember(data)
    }

    public async editMember(memberId: string, newName: string, newPower: number): Promise<MemberTypeV3 | null> {
        const response = await api(Actions.EDIT_MEMBER, { memberId, newName, newPower })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        const data: ResponseEditMemberType = await response.json()
        return await ClientSync.editMember(data)
    }

    public async findMember(memberId: string): Promise<MemberTypeV3 | null> {
        // Executado localmente
        const member = MemberUtils.find(ReactiveDB, memberId)
        return member ? member : null
    }



    public async createTeam(gameEvent: GameEvents, name: string): Promise<EventTeamType | null> {
        const response = await api(Actions.CREATE_TEAM, { gameEvent, name })
        if (!isSuccessfulResponse(response))
            return null

        // Sincronizar a informação localmente
        const team: ResponseCreateTeamType = await response.json()
        return await ClientSync.createTeam(team)
    }

    public async deleteTeam(gameEvent: GameEvents, teamId: string): Promise<boolean> {
        const response = await api(Actions.DELETE_TEAM, { gameEvent, teamId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente 
        const data = await response.json()
        return await ClientSync.deleteTeam(data)
    }

    public async listTeams(gameEvent: GameEvents): Promise<EventTeamType[]> {
        return TeamUtils.getAll(ReactiveDB, gameEvent)
    }

    public async addMemberToTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.ADD_MEMBER_TO_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const data = await response.json()
        return await ClientSync.addMemberToTeam(data)
    }

    public async removeMemberFromTeam(gameEvent: GameEvents, teamId: string, memberId: string): Promise<boolean> {
        const response = await api(Actions.REMOVE_MEMBER_FROM_TEAM, { gameEvent, teamId, memberId })
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        const data = await response.json()
        return await ClientSync.removeMemberFromTeam(data)
    }

    public async listFreeMembersForEvent(gameEvent: GameEvents): Promise<MemberTypeV3[]> {
        const response = await api(Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT, { gameEvent })
        if (!isSuccessfulResponse(response))
            return []

        // O servidor irá retornar as instancias atualizadas dos membros 
        // disponíveis, essa função também irá atualizar as instancias 
        // dos membros.

        const members: MemberTypeV3[] = await response.json()
        return MemberUtils.updateAll(ReactiveDB, ...members)
    }



    public async setCommissionState(memberId: string, state: CommissionState, updateTime: boolean): Promise<DatabaseOperationResult_SetCommissionState> {
        const response = await api(Actions.COMMISSION_SET_STATE, { memberId, state, updateTime })

        console.log(response)

        if (!isSuccessfulResponse(response)) {
            console.log('sem sucesso')
            return { updated: false }
        }

        // Sincronizar a informação localmente
        const data = await response.json()
        return await ClientSync.setCommissionState(data)
    }

    public async resetCommissionCycle(): Promise<boolean> {
        const response = await api(Actions.COMMISSION_RESET_CYCLE, {})
        if (!isSuccessfulResponse(response))
            return false

        // Sincronizar a informação localmente
        return await ClientSync.resetCommissionCycle({})
    }

    public async listCommissionMembers(state: CommissionState): Promise<MemberTypeV3[]> {
        console.log('listCommissionMembers')

        const response = await api(Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS, { state })
        if (!isSuccessfulResponse(response))
            return []

        // Não deixar a informação salva em cache, o servidor irá 
        // retornar uma array com os ids dos membros
        const membersIDS: string[] = await response.json()

        console.log(membersIDS)

        return MemberUtils.getList(ReactiveDB, ...membersIDS)
    }


    public async importData(file: File): Promise<boolean> {
        console.error('MÉTODO NAO IMPLEMENTADO AINDA')
        return false
    }

    public exportData(): boolean {
        console.error('MÉTODO NAO IMPLEMENTADO AINDA')
        return false
    }

}

class ClientSyncImpl {

    public syncFromPacket(packet: PacketType) {
        // Sincronizar o banco de dados
        if (packet.action === Actions.SYNC_ONLY_DATABASE_LOAD)
            return this.syncDatabaseLoad(packet)


        // Sincronizar as outras operações
        if (!packet.data)
            return

        switch (packet.action) {
            case Actions.SET_GUILD_NAME:
                return this.setGuildName(packet.data)

            case Actions.ADD_MEMBER:
                return this.addMember(packet.data)
            case Actions.DELETE_MEMBER:
                return this.deleteMember(packet.data)
            case Actions.EDIT_MEMBER:
                return this.editMember(packet.data)

            case Actions.CREATE_TEAM:
                return this.createTeam(packet.data)
            case Actions.DELETE_TEAM:
                return this.deleteTeam(packet.data)
            case Actions.ADD_MEMBER_TO_TEAM:
                return this.addMemberToTeam(packet.data)
            case Actions.REMOVE_MEMBER_FROM_TEAM:
                return this.removeMemberFromTeam(packet.data)

            case Actions.COMMISSION_SET_STATE:
                return this.setCommissionState(packet.data)
            case Actions.COMMISSION_RESET_CYCLE:
                return this.resetCommissionCycle(packet.data)

            default:
                console.warn(`ClientSync: Action[${packet.action}] não foi implementada no lado do cliente`)
                return
        }
    }

    private async syncDatabaseLoad(packet: PacketType) {
        if (!packet.exported)
            return

        if (packet.exported.definitions)
            ReactiveDB.definitions = packet.exported.definitions

        if (packet.exported.members)
            ReactiveDB.members = packet.exported.members

        if (packet.exported.events)
            ReactiveDB.events = packet.exported.events

        if (packet.exported.auditLog)
            ReactiveDB.auditLog = packet.exported.auditLog

        console.log('Banco de dados sincronizado!', packet.exported)
    }



    public async setGuildName(data: PostSetGuildNameType): Promise<boolean> {
        if (typeof data.newName !== 'string')
            return false

        ReactiveDB.definitions.guild = data.newName
        return true
    }



    public async addMember(data: ResponseAddMemberType): Promise<MemberTypeV3 | null> {
        if (validateMemberTypeV3(data) !== true)
            return null

        ReactiveDB.members.push(data as MemberTypeV3)

        return data as MemberTypeV3
    }

    public async deleteMember(data: PostDeleteMemberType): Promise<boolean> {
        if (typeof data.memberId !== 'string')
            return false

        const memberIndex = MemberUtils.findIndex(ReactiveDB, data.memberId)
        if (memberIndex > -1)
            ReactiveDB.members.splice(memberIndex, 1) // Remover o membro

        return true
    }

    public async editMember(data: ResponseEditMemberType): Promise<MemberTypeV3 | null> {
        if (validateMemberTypeV3(data) !== true)
            return null

        return MemberUtils.replaceSelf(ReactiveDB, data as MemberTypeV3)
    }


    public async createTeam(data: ResponseCreateTeamType): Promise<EventTeamType | null> {
        if (validateEventTeamType(data) !== true)
            return null

        ReactiveDB.events.push(data as EventTeamType)

        return data as EventTeamType
    }

    public async deleteTeam(data: PostDeleteTeamType): Promise<boolean> {
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string')
            return false

        const index = TeamUtils.findIndex(ReactiveDB, data.gameEvent, data.teamId)
        if (index < 0)
            // Retornar true porque nesse contexto o time foi removido no servidor
            // porem no cliente não existia, isso realmente pode acontecer????
            return true

        // Deletar o time
        ReactiveDB.events.splice(index, 1)
        return true
    }

    public async addMemberToTeam(data: PostAddMemberToTeamType): Promise<boolean> {
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return false

        const member = MemberUtils.find(ReactiveDB, data.memberId)
        if (member)
            TeamUtils.setMemberTeamId(member, data.gameEvent, data.teamId)

        const team = TeamUtils.get(ReactiveDB, data.gameEvent, data.teamId)
        if (team)
            team.count += 1

        return true
    }

    public async removeMemberFromTeam(data: PostRemoveMemberFromTeamType): Promise<boolean> {
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return false

        const member = MemberUtils.find(ReactiveDB, data.memberId)
        if (member)
            TeamUtils.setMemberTeamId(member, data.gameEvent, UNDEFINED_TEAM)

        const team = TeamUtils.get(ReactiveDB, data.gameEvent, data.teamId)
        if (team)
            team.count -= 1

        return true
    }


    public async setCommissionState(data: ResponseSetCommissionSateType): Promise<DatabaseOperationResult_SetCommissionState> {
        if (typeof data.memberId !== 'string' || typeof data.state !== 'number' || typeof data.time !== 'number')
            return { updated: false }

        const member = MemberUtils.find(ReactiveDB, data.memberId)
        if (member) {
            member.state = data.state
            member.time = data.time
        }

        return {
            updated: true,
            ...data
        }
    }

    public async resetCommissionCycle(data: PostResetCommissionCycleType): Promise<boolean> {
        for (const member of ReactiveDB.members) {
            member.state = CommissionState.AVAILABLE
            member.time = 0
        }

        return true
    }

}


export const ClientDatabase = new ClientDatabaseApi()

export const ClientSync = new ClientSyncImpl()

