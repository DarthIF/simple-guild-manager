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
     * Usado apenas por pacotes de sincronização de usuários online
     */
    online_packet?: PacketType_OnlineUser
}

export type PacketType_OnlineUser = {
    name: string
    online: boolean
    role?: Role
}
