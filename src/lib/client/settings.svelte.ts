import { alertWith, getAppropriatedString } from "$lib/strings"
import { errors } from "$lib/strings/strings"
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
    /**
     * `true` se estiver no modo de screen shot
     */
    screenShotMode: false,

    /**
     * `true` se estiver em uma pagina do Github
     */
    isGithubPages: isInGithub(),

    /**
     * Linguagem atual para o aplicativo
     */
    lang: getCurrentSupportedLang(),

    /**
     * `true` se estiver carregando alguma informação
     */
    loading: false
})



// Atualizar o atributo "lang" da pagina sempre que 
// a configuração reativa mudar
$effect.root(() => {
    $effect(updateDocumentLanguage)
})



export function THEN_CALLBACK_COMPLETE_LOAD(v: boolean) {
    if (!v) {
        alertWith(errors.unknown_error)
        return
    }

    ReactiveSettings.loading = false
}