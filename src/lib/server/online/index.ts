import { Actions, Role } from '$lib/common/database/enums'
import type { PacketType_OnlineUser } from '$lib/common/packets/type'
import type { UserV2 } from '../database/user'
import { includePacketV2 } from '../packets'
import { fancyLog } from '../util/server-log'

/**
 * Map<token, username>()
 */
const currentUsersOnline = new Map<string, string>()
const TAG = 'ServerOnline'


type SetUserOnlineParams = {
    online: boolean
    user: {
        token: string
        name?: string
        icon?: string
    }
    packet?: {
        send: boolean
        autor?: string
    }
}


export function getOnlineCount(): number {
    return currentUsersOnline.size
}

export function getOnlineUsers(): string[] {
    return [...currentUsersOnline.values()]
}

export function getOnlineUsersForPacket() {
    const packets = new Array<PacketType_OnlineUser>()

    currentUsersOnline.forEach((username, token) => {
        packets.push({
            token,
            online: true,
            name: username
        })
    })

    return packets
}

export function setUserOnline(params: SetUserOnlineParams) {
    fancyLog(TAG, `Usuário [${params.user.token}] está ${params.online ? 'online' : 'offline'}`)

    if (params.online) {
        // currentOnline.add(params.user.token)
        currentUsersOnline.set(params.user.token, params.user.name || '?')
    } else {
        // currentOnline.delete(params.user.token)
        currentUsersOnline.delete(params.user.token)
    }

    // Adicionar um pacote
    if (params.packet?.send) {
        includePacketV2(params.packet.autor, {
            action: Actions.SYNC_ONLY_ONLINE_USER,
            online_user: {
                online: params.online,
                token: params.user.token,
                name: params.user.name,
                icon: params.user.icon,
            }
        })
    }
}

export function checkIfHasSendedToAllUsersOnline(sendedTo: Set<string>): boolean {
    for (const online of currentUsersOnline.keys()) {
        if (!sendedTo.has(online))
            return false
    }

    return true
}