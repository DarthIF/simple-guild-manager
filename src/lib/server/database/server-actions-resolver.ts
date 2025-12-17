import { StatusCodes } from 'http-status-codes'
import type { PostAddMemberToTeamType, PostAddMemberType, PostCreateTeamType, PostDeleteMemberType, PostDeleteTeamType, PostEditMemberType, PostRemoveMemberFromTeamType, PostResetCommissionCycleType, PostSetCommissionSateType, PostSetGuildNameType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent, PostTypes, ResponseSetCommissionSateType } from '$lib/common/database/post-types'
import type { Nullable } from '$lib/utils/types'
import type { UserV2 } from './user'
import { ActionResolverBase } from './ar'
import { Actions } from '$lib/common/database/enums'
import { send } from '$lib/utils/http-util'
import { includePacket } from '../packets'
import { clearMongoID } from '../util/object-cleaner'


export class ServerActionResolver extends ActionResolverBase<Response> {

    protected async defaultResolve(): Promise<Response> {
        return send(StatusCodes.SERVICE_UNAVAILABLE)
    }


    public async setGuildName(user: Nullable<UserV2>, data: PostSetGuildNameType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.newName !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o nome
        const updated = await this.db.setGuildName(data.newName, user?.name)
        if (updated) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.SET_GUILD_NAME, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async addMember(user: Nullable<UserV2>, data: PostAddMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.name !== 'string' || typeof data.power !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro ao banco de dados
        let member = await this.db.addMember(data.name, data.power, user?.name)
        if (member) {
            // Remover o id do mongodb
            member = clearMongoID(member)

            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.ADD_MEMBER, member)

            return send(StatusCodes.OK, member)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async deleteMember(user: Nullable<UserV2>, data: PostDeleteMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro do banco de dados
        const deleted = await this.db.deleteMember(data.memberId, user?.name)
        if (deleted) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.DELETE_MEMBER, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async editMember(user: Nullable<UserV2>, data: PostEditMemberType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.newName !== 'string' || typeof data.newPower !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Editar o membro
        let member = await this.db.editMember(data.memberId, data.newName, data.newPower, user?.name)
        if (member) {
            // Remover o id do mongodb
            member = clearMongoID(member)

            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.EDIT_MEMBER, member)

            return send(StatusCodes.OK, member)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async createTeam(user: Nullable<UserV2>, data: PostCreateTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.name !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Criar a equipe
        let team = await this.db.createTeam(data.gameEvent, data.name, user?.name)
        if (team) {
            // Remover o id do mongodb
            team = clearMongoID(team)

            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.CREATE_TEAM, team)

            return send(StatusCodes.OK, team)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async deleteTeam(user: Nullable<UserV2>, data: PostDeleteTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Deletar a equipe
        const deleted = await this.db.deleteTeam(data.gameEvent, data.teamId, user?.name)
        if (deleted) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.DELETE_TEAM, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async addMemberToTeam(user: Nullable<UserV2>, data: PostAddMemberToTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Adicionar o membro a equipe
        const added = await this.db.addMemberToTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (added) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.ADD_MEMBER_TO_TEAM, data)

            return send(StatusCodes.OK, data)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async removeMemberFromTeam(user: Nullable<UserV2>, data: PostRemoveMemberFromTeamType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Remover o membro da equipe
        const removed = await this.db.removeMemberFromTeam(data.gameEvent, data.teamId, data.memberId, user?.name)
        if (removed) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.REMOVE_MEMBER_FROM_TEAM, data)

            return send(StatusCodes.OK, data)
        }


        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async setCommissionState(user: Nullable<UserV2>, data: PostSetCommissionSateType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.state !== 'number' || typeof data.updateTime !== 'boolean')
            return send(StatusCodes.BAD_REQUEST)

        // Atualizar o membro
        const result = await this.db.setCommissionState(data.memberId, data.state, data.updateTime, user?.name)
        if (result.updated) {
            const response: ResponseSetCommissionSateType = {
                memberId: result.memberId,
                state: result.state,
                time: result.time
            }

            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.COMMISSION_SET_STATE, response)

            return send(StatusCodes.OK, response)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    public async resetCommissionCycle(user: Nullable<UserV2>, data: PostResetCommissionCycleType): Promise<Response> {
        const reset = await this.db.resetCommissionCycle(user?.name)
        if (reset) {
            // Adicionar um pacote pendente se for pertinente
            includePacket(user?.token, Actions.COMMISSION_RESET_CYCLE, {})

            return send(StatusCodes.OK)
        }

        // Erro interno
        return send(StatusCodes.INTERNAL_SERVER_ERROR)
    }


    public async syncListCommissionMembers(user: Nullable<UserV2>, data: PostSyncOnlyListCommissionMembersType): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.state !== 'number')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await this.db.listCommissionMembers(data.state)

        // Adicionar um pacote pendente se for pertinente
        includePacket(user?.token, Actions.SYNC_ONLY_LIST_COMMISSION_MEMBERS, members)

        return send(StatusCodes.OK, members)
    }

    public async syncListFreeMembersForEvent(user: Nullable<UserV2>, data: PostSyncOnlyListFreeMembersForEvent): Promise<Response> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string')
            return send(StatusCodes.BAD_REQUEST)

        // Listar os membros
        const members = await this.db.listFreeMembersForEvent(data.gameEvent)

        // Adicionar um pacote pendente se for pertinente
        includePacket(user?.token, Actions.SYNC_ONLY_LIST_FREE_MEMBERS_FOR_EVENT, members)

        return send(StatusCodes.OK, members)
    }

}
