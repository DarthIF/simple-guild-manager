import type { Nullable } from '$lib/utils/types'
import { type DatabaseTypeV3, type MemberTypeV3 } from '../constants-and-types'
import { MEMBER_STRUCTURE_TEMPLATE, type MemberTypeV4 } from '../constants-and-types-2'


export function find(database: DatabaseTypeV3, memberId: string): Nullable<MemberTypeV3> {
    const member = database.members.find(member => member.id === memberId)
    return member ? member : null
}

export function findIndex(database: DatabaseTypeV3, memberId: string): number {
    return database.members.findIndex(member => member.id === memberId)
}

export function getList(database: DatabaseTypeV3, ...ids: string[]): MemberTypeV3[] {
    const result: MemberTypeV3[] = []
    for (const member of database.members) {
        for (const id of ids) {
            if (member.id === id)
                result.push(member)
        }
    }

    return result
}


export function replaceSelf(database: DatabaseTypeV3, member: MemberTypeV3): Nullable<MemberTypeV3> {
    const index = findIndex(database, member.id)

    if (index < 0)
        return null

    database.members[index] = member

    return member
}

export function updateAll(database: DatabaseTypeV3, ...members: MemberTypeV3[]) {
    for (let i = 0; i < members.length; i++) {
        const member = members[i]
        let updated = false

        for (let j = 0; j < database.members.length; j++) {
            if (database.members[j].id !== member.id)
                // Continuar a iteração sobre o ReactiveDB.members
                continue

            // Atualizar o membro
            database.members[j] = member
            updated = true

            // Parar a iteração sobre o ReactiveDB.members
            break
        }

        // Adicionar o membro, caso não tenha sido atualizado
        if (!updated) {
            database.members.push(member)
        }
    }

    // Retornar a array de membros atualizados(e ou adicionados)
    return members
}


export function createEmpty(): MemberTypeV4 {
    const member: MemberTypeV4 = JSON.parse(JSON.stringify(MEMBER_STRUCTURE_TEMPLATE))
    member.id = 'empty'
    member.name = 'Empty member'

    return member
}
