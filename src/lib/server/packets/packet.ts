import type { Actions } from '$lib/common/database/enums'

export type PacketType = {
    action: Actions
    data: any
}