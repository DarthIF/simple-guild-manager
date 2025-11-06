import { fancyLog } from "../util/server-log"


const currentOnline = new Set<string>()
const TAG = 'ServerOnline'


export function getOnlineCount(): number {
    return currentOnline.size
}

export function getOnlineUsers(): string[] {
    return [...currentOnline]
}

export function setUserOnline(token: string, online: boolean) {
    fancyLog(TAG, `Usuário [${token}] está ${online ? 'online' : 'offline'}`)

    if (online)
        currentOnline.add(token)
    else
        currentOnline.delete(token)
}

export function checkIfHasSendedToAllUsersOnline(sendedTo: Set<string>): boolean {
    for (const online of currentOnline) {
        if (!sendedTo.has(online))
            return false
    }

    return true
}