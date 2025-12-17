import type { PostSetGuildNameType, PostAddMemberType, PostDeleteMemberType, PostEditMemberType, PostCreateTeamType, PostDeleteTeamType, PostAddMemberToTeamType, PostRemoveMemberFromTeamType, PostSetCommissionSateType, PostResetCommissionCycleType, PostSyncOnlyListCommissionMembersType, PostSyncOnlyListFreeMembersForEvent } from '$lib/common/database/post-types';
import type { UserV2 } from '$lib/server/database/user'
import type { Nullable } from '$lib/utils/types'
import { ActionResolverBase } from '$lib/server/database/ar'
import { StatusCodes } from 'http-status-codes'


function CommonReturn(obj: any, valid = StatusCodes.OK, invalid = StatusCodes.INTERNAL_SERVER_ERROR) {
    return (obj !== false && obj !== null && obj !== undefined)
        ? valid
        : invalid
}


export class ClientActionResolver extends ActionResolverBase<StatusCodes> {

    protected async defaultResolve(): Promise<StatusCodes> {
        return StatusCodes.SERVICE_UNAVAILABLE
    }


    public async setGuildName(user: Nullable<UserV2>, data: PostSetGuildNameType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.newName !== 'string')
            return StatusCodes.BAD_REQUEST

        // Atualizar o nome
        const result = await this.db.setGuildName(data.newName)
        return CommonReturn(result)
    }


    public async addMember(user: Nullable<UserV2>, data: PostAddMemberType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.name !== 'string' || typeof data.power !== 'number')
            return StatusCodes.BAD_REQUEST

        // Adicionar o membro ao banco de dados
        const member = await this.db.addMember(data.name, data.power)
        return CommonReturn(member)
    }

    public async deleteMember(user: Nullable<UserV2>, data: PostDeleteMemberType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string')
            return StatusCodes.BAD_REQUEST

        // Remover o membro do banco de dados
        const deleted = await this.db.deleteMember(data.memberId)
        return CommonReturn(deleted)
    }

    public async editMember(user: Nullable<UserV2>, data: PostEditMemberType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.newName !== 'string' || typeof data.newPower !== 'number')
            return StatusCodes.BAD_REQUEST

        // Editar o membro
        const member = await this.db.editMember(data.memberId, data.newName, data.newPower)
        return CommonReturn(member)
    }


    public async createTeam(user: Nullable<UserV2>, data: PostCreateTeamType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.name !== 'string')
            return StatusCodes.BAD_REQUEST

        // Criar a equipe
        const team = await this.db.createTeam(data.gameEvent, data.name)
        return CommonReturn(team)
    }

    public async deleteTeam(user: Nullable<UserV2>, data: PostDeleteTeamType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string')
            return StatusCodes.BAD_REQUEST

        // Deletar a equipe
        const deleted = await this.db.deleteTeam(data.gameEvent, data.teamId)
        return CommonReturn(deleted)
    }

    public async addMemberToTeam(user: Nullable<UserV2>, data: PostAddMemberToTeamType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return StatusCodes.BAD_REQUEST

        // Adicionar o membro a equipe
        const added = await this.db.addMemberToTeam(data.gameEvent, data.teamId, data.memberId)
        return CommonReturn(added)
    }

    public async removeMemberFromTeam(user: Nullable<UserV2>, data: PostRemoveMemberFromTeamType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.gameEvent !== 'string' || typeof data.teamId !== 'string' || typeof data.memberId !== 'string')
            return StatusCodes.BAD_REQUEST

        // Remover o membro da equipe
        const removed = await this.db.removeMemberFromTeam(data.gameEvent, data.teamId, data.memberId)
        return CommonReturn(removed)
    }


    public async setCommissionState(user: Nullable<UserV2>, data: PostSetCommissionSateType): Promise<StatusCodes> {
        // Validar os tipos antes
        if (typeof data.memberId !== 'string' || typeof data.state !== 'number' || typeof data.updateTime !== 'boolean')
            return StatusCodes.BAD_REQUEST

        // Atualizar o membro
        const updated = await this.db.setCommissionState(data.memberId, data.state, data.updateTime)
        return CommonReturn(updated)
    }

    public async resetCommissionCycle(user: Nullable<UserV2>, data: PostResetCommissionCycleType): Promise<StatusCodes> {
        const reset = await this.db.resetCommissionCycle()
        return CommonReturn(reset)
    }


    public async syncListCommissionMembers(user: Nullable<UserV2>, data: PostSyncOnlyListCommissionMembersType): Promise<StatusCodes> {
        console.warn('ClientActionResolver.syncListCommissionMembers sempre retorna -> StatusCodes.OK', StatusCodes.OK)

        return StatusCodes.OK
    }

    public async syncListFreeMembersForEvent(user: Nullable<UserV2>, data: PostSyncOnlyListFreeMembersForEvent): Promise<StatusCodes> {
        console.warn('ClientActionResolver.syncListFreeMembersForEvent sempre retorna -> StatusCodes.OK', StatusCodes.OK)

        return StatusCodes.OK
    }

}
