import type { Actions } from '$lib/common/database/enums'
import type { ServerPacketType } from './packet'
import type { Nullable, NullableU } from '$lib/utils/types'
import { checkIfHasSendedToAllUsersOnline, getOnlineCount } from '../online'
import { fancyLog } from '../util/server-log'


const TAG = 'PacketStorage'
const pendent = new Array<ServerPacketType>()


export function nextPacket(token: string): Nullable<ServerPacketType> {
    const packet = pendent[0]

    // Sem pacotes pendentes
    if (!packet)
        return null

    // Verifica se o usuário já acessou o pacote
    if (packet.sended.has(token))
        return null

    // Salvar que esse usuário já acessou o pacote
    packet.sended.add(token)

    // Verificar se ja enviou para todos os usuários online
    if (checkIfHasSendedToAllUsersOnline(packet.sended)) {
        // Remover o pacote dos pendentes pois já foi enviado para todos
        pendent.splice(0, 1)

        fancyLog(TAG, `um pacote pendente foi removido, restam ${pendent.length} pacotes`)
    }

    return packet
}

export function includePacket(author: NullableU<string>, action: Actions, data: any): boolean {
    fancyLog(TAG, `tentando incluir um pacote...`)

    if (author === undefined || author === null) {
        fancyLog(TAG, 'pacote sem autor, ignorado.')
        return false
    }

    const onlineCount = getOnlineCount()
    if (onlineCount < 1) {
        fancyLog(TAG, `sem usuários online insuficientes: ${onlineCount}`)
        return false
    }

    const packet = {
        author,
        sended: new Set<string>(),
        send: { action, data }
    }

    fancyLog(TAG, `pacote incluído`, packet)

    pendent.push(packet)
    return true
}