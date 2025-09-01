import type { LayoutLoad } from './$types'

// Não gerar a pagina estática
export const prerender = false
export const ssr = false

export const load = (async () => {
    return {}
}) satisfies LayoutLoad