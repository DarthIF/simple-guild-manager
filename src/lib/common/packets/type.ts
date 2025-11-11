import type { DatabaseTypeV3, MemberTypeV3 } from "../database/constants-and-types"
import type { Actions } from "../database/enums"
import type { PostTypes } from "../database/post-types"

export type PacketType = {
    action: Actions
    data?: PostTypes & Partial<MemberTypeV3>

    /**
     * Usado apenas quando esta sincronizando o banco de dados quando o cliente se conecta
     */
    exported?: Partial<DatabaseTypeV3>
}
