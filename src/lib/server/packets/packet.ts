import type { PacketType } from '$lib/common/packets/type'

export type ServerPacketType = {
    author: string
    sended: Set<string>
    send: PacketType
}