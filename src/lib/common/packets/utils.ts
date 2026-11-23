import { Base64 } from "js-base64"
import type { PacketType } from "./type"
import type { NullableU } from "$lib/utils/types"

/**
 * Converte um {@link Object} em Json e depois em Base64
 * 
 * @param obj 
 * @returns 
 */
export function packetEncode(toEncode: Partial<PacketType>) {
    const str = JSON.stringify(toEncode)
    return Base64.encode(str)
        .replaceAll('\n', ' ')
        .trim()
}

/**
 * Analisa uma string Base64 para converte-la em um JSON e depois 
 * em um {@link Object} javascript 
 * 
 * @param b64Str 
 * @returns 
 */
export function packetDecode(toDecode: NullableU<string>): NullableU<Partial<PacketType>> {
    if (toDecode === undefined)
        return undefined

    if (toDecode === null || typeof toDecode !== 'string' || toDecode === '')
        return null

    try {
        const str = Base64.decode(toDecode)
        return JSON.parse(str)
    } catch (error) {
        console.error(error)
        return null
    }
}

/**
 * Função usada no cliente para validar um pacote recebido
 * 
 * @param packet pacote a ser verificado
 * @param onValid callback quando o pacote é valido
 * @param onInvalid callback para erros
 */
export function validatePacket(packet: NullableU<Partial<PacketType>>, onValid: (packet: Partial<PacketType>) => void, onInvalid: (message: string, packet: NullableU<Partial<PacketType>>) => void) {
    // Pacote vazio
    if (!packet)
        return onInvalid('Received empty data', packet)

    // Pacote sem ação
    if (!packet.action)
        return onInvalid('Received empty action', packet)

    // Pacotes validos
    if (packet.data || packet.exported || packet.sync_online_users
        || packet.online_user) {
        return onValid(packet)
    }

    // Não configurado ou invalido
    onInvalid('The packet contains an action, but the data was not identified. Check if the packet is configured in [lib/common/packets/utils.ts#validatePacket]', packet)
}