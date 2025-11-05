import type { PacketType } from '$lib/common/packets/type'

export type ServerPacketType = {
    author: string | null | undefined
    send: PacketType
}