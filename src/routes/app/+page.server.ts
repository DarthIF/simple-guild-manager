import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import * as database from '$lib/server/database/simple-guild-database'

export const load = (async ({ cookies }) => {
    const session = cookies.get('session')

    if (!session)
        // Redirecionar para o login
        redirect(303, '/auth')

    const user = await database.findSession(session)

    if (!user) {
        // Apagar o cookie invalido
        cookies.delete('session', { path: '/' })

        // Redirecionar para o login
        redirect(303, '/auth')
    }

    return {
        name: user.name,
        icon: user.icon,
    }
}) satisfies PageServerLoad