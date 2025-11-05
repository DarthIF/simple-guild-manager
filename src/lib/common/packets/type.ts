import type { Actions } from "../database/enums"

export type PacketType = {
    action: Actions
    data: any
}