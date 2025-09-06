import { getCurrentSupportedLang } from "$lib/utils/lang-util"


/**
 * Verifica se está em uma pagina do github
 * 
 * @returns true se voce estiver no github
 */
export function isInGithub(): boolean {
    if (typeof location === 'undefined')
        return false

    const regex = /^[a-zA-Z0-9]+\.github\.io$/g
    return regex.test(location.hostname)
}

/**
 * Função para atualizar o atributo "lang" da pagina
 */
export function updateDocumentLanguage() {
    if (typeof document === 'undefined' || typeof document.documentElement === 'undefined')
        return

    document.documentElement.lang = ReactiveSettings.lang.code
}



export const ReactiveSettings = $state({
    screenShotMode: false,
    isGithubPages: isInGithub(),
    lang: getCurrentSupportedLang(),
})


// Atualizar sempre que a configuração mudar
$effect.root(() => {
    $effect(updateDocumentLanguage)
})
