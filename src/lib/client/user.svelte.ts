import { Role } from '$lib/common/database/enums'
import type { PacketType_OnlineUser } from '$lib/common/packets/type'

/**
 * Informações locais do usuário
 */
export const UserInformation = $state({
    token: '',
    name: '',
    icon: '', 
})


export const OnlineUsers = $state({
    list: new Array<PacketType_OnlineUser>()
})