import { alertWith, type LocalizedString } from "$lib/strings"
import { errors } from "$lib/strings/strings"
import { getCurrentSupportedLang, type AppLanguageType, getLangWithCode, getDefaultLang } from "$lib/utils/lang-util"


const KEY_LOCAL_STORAGE_LANG = 'app-language'



/**
 * Função para atualizar a configuração de idioma
 */
export function setLanguage(newLang: AppLanguageType) {
    if (ReactiveSettings.lang.code === newLang.code)
        return

    ReactiveSettings.lang = newLang
}



/**
 * Verifica se está em uma pagina do github
 * 
 * @returns true se voce estiver no github
 */
function isInGithub(): boolean {
    if (typeof location === 'undefined')
        return false

    const regex = /^[a-zA-Z0-9]+\.github\.io$/g
    return regex.test(location.hostname)
}



/**
 * Função para atualizar o atributo "lang" da pagina `<html lang=''>`
 */
function updateDocumentLanguage(): void {
    if (typeof document === 'undefined' || typeof document.documentElement === 'undefined')
        return

    document.documentElement.lang = ReactiveSettings.lang.code
}

/**
 * Função para carregar a preferencia salva de idioma do usuário, ou retornar
 * o idioma padrão se não tiver salvo
 */
function loadLocalSettings_Lang(): AppLanguageType {
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem === 'undefined')
        return getDefaultLang()

    const value = localStorage.getItem(KEY_LOCAL_STORAGE_LANG)
    const lang = getLangWithCode(value)
    if (lang)
        return lang

    return getCurrentSupportedLang()
}

/**
 * Função para salvar a preferencia de idioma do usuário
 */
function saveLocalSettings_Lang() {
    if (typeof localStorage === 'undefined')
        return

    localStorage.setItem(KEY_LOCAL_STORAGE_LANG, ReactiveSettings.lang.code)
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
    lang: loadLocalSettings_Lang(),

    /**
     * `true` se estiver carregando alguma informação
     */
    loading: false
})



// Atualizar o atributo "lang" da pagina sempre que 
// a configuração reativa mudar
$effect.root(() => {
    $effect(updateDocumentLanguage)
    $effect(saveLocalSettings_Lang)
})



function start() {
    ReactiveSettings.loading = true
}

function finish(error: boolean = false, message: string | LocalizedString = errors.unknown_error) {
    if (error && message) {
        alertWith(message)
    }

    ReactiveSettings.loading = false
}

export const Loading = {
    start,
    finish,
}










/**
 * @deprecated
 */
export function THEN_CALLBACK_COMPLETE_LOAD(v: boolean) {
    if (!v) {
        alertWith(errors.unknown_error)
        return
    }

    ReactiveSettings.loading = false
}