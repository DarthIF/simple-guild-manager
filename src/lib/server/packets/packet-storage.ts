import type { Actions } from '$lib/common/database/enums'
import type { ServerPacketType } from './packet'
import { getOnlineCount } from '../online'
import { fancyLog } from '../util/server-log'
import type { NullableU } from '$lib/utils/types'


const TAG = 'PacketStorage'
const pendent = new Array<ServerPacketType>()


export function nextPacket(): ServerPacketType | undefined {
    return pendent.shift()
}

export function includePacket(author: NullableU<string>, action: Actions, data: any): boolean {
    fancyLog(TAG, `tentando incluir um pacote...`)

    if (getOnlineCount() < 1)
        return false

    const packet = {
        author,
        send: { action, data }
    }

    fancyLog(TAG, `pacote incluído`, packet)

    pendent.push(packet)
    return true
}