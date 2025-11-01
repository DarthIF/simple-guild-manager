import type { Actions } from '$lib/common/database/enums'
import type { PacketType } from './packet'
import { getOnlineCount } from '../online'

const pendent = new Array<PacketType>()

export function nextPacket(): PacketType | undefined {
    return pendent.shift()
}

export function includePacket(action: Actions, data: any): boolean {
    if (getOnlineCount() < 1)
        return false

    pendent.push({ action, data })
    return true
}