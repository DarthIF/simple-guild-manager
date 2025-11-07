import { UNDEFINED_TEAM, type DatabaseJsonType } from "./constants-and-types"
import { CommissionState, GameEvents, Role } from "./enums"
import { currentUnixTime } from "$lib/utils/time-util"
import { setMemberTeamId } from "./utils";


export const LOCAL_STORAGE_KEY_V0 = 'team-creator'
export const LOCAL_STORAGE_KEY_V1 = 'guild-manager-local';


export function v0_to_v1(backup: string | null | undefined) {
    // Backup invalido
    if (typeof backup !== 'string')
        return null

    backup = backup.trim()
    if (backup.length < 1)
        return null

    try {
        // Ler o backup antigo
        const v0: DatabaseTypeV0 | undefined = JSON.parse(backup)
        if (!v0 || typeof v0 !== 'object')
            return null

        // Converter para o novo formato
        // O registro de auditoria será ignorado
        const v1: DatabaseJsonType = {
            version: 1,
            userAgent: '💻',
            definitions: {
                id: 'default',
                guild: 'Guild Name 🎈',
                maxMembers: 30
            },
            members: [],
            events: [],
            auditLog: []
        }

        if (v0.organization) {
            v1.definitions.guild = v0.organization
        }

        if (Array.isArray(v0.members)) {
            for (let i = 0; i < v0.members.length; i++) {
                const member: MemberTypeV0 | undefined = v0.members[i]
                if (!member)
                    continue

                // Incluir o membro na nova versão
                v1.members.push({
                    id: member.id || (currentUnixTime() + i).toString(),
                    name: member.name || '',
                    power: member.power || 0,
                    role: Role.MEMBER,
                    offline: 0,
                    state: member.commissions?.state || CommissionState.AVAILABLE,
                    time: member.commissions?.time || 0,
                    missed: member.commissions?.missed || 0,
                    worldTree: UNDEFINED_TEAM,
                    minesInDungeon: UNDEFINED_TEAM,
                    cloudKingdom: UNDEFINED_TEAM,
                    cassinoOnYacht: UNDEFINED_TEAM,
                    infernoRally: UNDEFINED_TEAM
                })
            }

        }

        if (v0.events) {
            /**
             * Função local para importar os times da V0 para a V1
             * 
             * @param gameEvent Evento do jogo
             * @param teams Array com os times
             */
            function importTeams(gameEvent: GameEvents, teams: TeamTypeV0[] | undefined) {
                if (!teams)
                    return

                for (let i = 0; i < teams.length; i++) {
                    const team: TeamTypeV0 | undefined = teams[i]
                    if (!team)
                        continue

                    const teamId = team.id || (currentUnixTime() + i).toString()
                    const teamName = team.name || ('Team ' + (i + 1))

                    let membersCount = 0
                    if (Array.isArray(team.members)) {
                        // Iterar sobre os id's dos membros da equipe na versão antiga
                        for (const id of team.members) {
                            if (!id)
                                continue

                            // Definir o time para o membro na versão nova
                            for (const member of v1.members) {
                                if (member.id === id) {
                                    setMemberTeamId(member, gameEvent, teamId)
                                    membersCount++
                                }
                            }
                        }
                    }

                    // Incluir a equipe na nova versão
                    v1.events.push({
                        event: gameEvent,
                        id: teamId,
                        name: teamName,
                        count: membersCount,
                        size: 4
                    })
                }
            }

            importTeams(GameEvents.WORLD_TREE, v0.events.worldTree)
            importTeams(GameEvents.MINES_IN_DUNGEON, v0.events.minesInDungeon)
            importTeams(GameEvents.CLOUD_KINGDOM, v0.events.cloudKingdom)
            importTeams(GameEvents.CASSINO_ON_YACHT, v0.events.cassinoOnYacht)
        }

        return v1
    } catch (error) {
        console.log('parse error on v0_to_v1()')
        console.error(error)
    }

    return null
}


/**
 * Atualizar as versões antigas
 */
export function updateOldVersions() {
    if (typeof localStorage === 'undefined') {
        console.error('A função "updateOldVersions()" deve ser executada no navegador')
        return
    }

    const v1 = v0_to_v1(localStorage.getItem(LOCAL_STORAGE_KEY_V0))
    if (v1) {
        localStorage.setItem(LOCAL_STORAGE_KEY_V1, JSON.stringify(v1)) // Salvar a nova versão
        localStorage.removeItem(LOCAL_STORAGE_KEY_V0) // Remover a versão antiga

        alert('Atualizado o backup local:\nV0 -> V1')
    }

}



// Backup V0 ------------------------------------

type DatabaseTypeV0 = {
    organization?: string
    members?: MemberTypeV0[]
    events?: EventsTypeV0
    auditLog?: AuditLogTypeV0[]
}

type MemberTypeV0 = {
    id?: string
    name?: string
    power?: number
    commissions?: {
        state?: CommissionState
        time?: number
        missed?: number
    }
}

type EventsTypeV0 = {
    worldTree?: TeamTypeV0[]
    minesInDungeon?: TeamTypeV0[]
    cloudKingdom?: TeamTypeV0[]
    cassinoOnYacht?: TeamTypeV0[]
}

type TeamTypeV0 = {
    id?: string
    name?: string
    members?: string[]
}

type AuditLogTypeV0 = {
    timestamp: string
    action: string
    details: AuditLogDetailsV0
}

type AuditLogDetailsV0 = {
    name?: string
    power?: number

    gameEvent?: string
    teamName?: string
    memberId?: string

    oldName?: string
    newName?: string

    state?: number
}