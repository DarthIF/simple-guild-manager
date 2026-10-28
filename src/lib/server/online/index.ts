import { Actions } from "$lib/common/database/enums";
import { includePacketV2 } from "../packets";
import { fancyLog } from "../util/server-log"


const currentOnline = new Set<string>()
const TAG = 'ServerOnline'


export function getOnlineCount(): number {
    return currentOnline.size
}

export function getOnlineUsers(): string[] {
    return [...currentOnline]
}

export function setUserOnline(token: string, online: boolean, sendPacket: boolean, packetAuthor?: string) {
    fancyLog(TAG, `Usuário [${token}] está ${online ? 'online' : 'offline'}`)

    if (online)
        currentOnline.add(token)
    else
        currentOnline.delete(token)

    // Adicionar um pacote
    if (sendPacket) {
        includePacketV2(packetAuthor, {
            action: Actions.SYNC_ONLY_ONLINE_USER,
            online_packet: { name: token, online }
        })
    }
}

export function checkIfHasSendedToAllUsersOnline(sendedTo: Set<string>): boolean {
    for (const online of currentOnline) {
        if (!sendedTo.has(online))
            return false
    }

    return true
}