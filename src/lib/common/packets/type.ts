import type { Undefinable } from "$lib/utils/types";
import type { DatabaseTypeV3, MemberTypeV3 } from "../database/constants-and-types"
import type { Actions, Role } from "../database/enums"
import type { PostTypes } from "../database/post-types"

export type PacketType = {
    action: Actions
    data?: PostTypes & Partial<MemberTypeV3>

    /**
     * Usado apenas quando na sincronização inicial do banco de dados
     */
    exported?: Partial<DatabaseTypeV3>

    /**
     * Usado apenas por pacotes de sincronização de mudança de usuários online
     */
    online_user?: PacketType_OnlineUser

    /**
     * Usado na sincronização inicial de usuários online
     */
    sync_online_users?: PacketType_OnlineUser[]
}

export type PacketType_OnlineUser = {
    online: boolean
    token: string
    name?: string
    icon?: string
}
