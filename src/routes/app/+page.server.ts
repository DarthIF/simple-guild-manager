import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { RemoteDatabase } from '$lib/server/database/server-database.svelte';

export const load = (async ({ cookies }) => {
    const session = cookies.get('session')

    if (!session)
        // Usuário sem um token de seção, redireciona-lo para o login
        redirect(303, '/login')

    const user = await RemoteDatabase.findSession(session)

    if (!user) {
        // Apagar o cookie invalido
        cookies.delete('session', { path: '/' })

        // Redirecionar para o login
        redirect(303, '/login')
    }

    return {
        name: user.name,
        icon: user.icon,
    }
}) satisfies PageServerLoad