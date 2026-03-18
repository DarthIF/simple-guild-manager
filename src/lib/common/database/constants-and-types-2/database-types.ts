import type { AuditLogTypeV3 } from './audit-log-types'
import type { EventTeamTypeV1 } from './event-teams-types'
import type { GuildTypeV1 } from './guild-types'
import type { MemberTypeV4 } from './member-types'
import { DEFINITIONS_DEFAULT_ID } from './constants'



export type ManifestTypeV1 = {
    /**
     * O valor deverá ser sempre {@link DEFINITIONS_DEFAULT_ID}
     */
    id: 'default'

    /**
     * Nome exibido no titulo do aplicativo
     */
    name: string
}

export type DatabaseTypeV4 = {
    manifest: ManifestTypeV1
    guilds: GuildTypeV1[]
    members: MemberTypeV4[]
    events: EventTeamTypeV1[]
    auditLog: AuditLogTypeV3[]
}

export type DatabaseJsonTypeV4 = {
    /**
     * Versão do arquivo de backup
     */
    version: number
    /**
     * Navegador que gerou o arquivo de backup
     */
    userAgent: string
} & DatabaseTypeV4



export type DatabaseExportOptionsType = {
    [Key in keyof DatabaseTypeV4]?: boolean
}