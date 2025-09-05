import { getCurrentSupportedLang } from './lang-util'


function isInGithub() {
    if (typeof location === 'undefined')
        return false

    const regex = /^[a-zA-Z0-9]+\.github\.io$/g
    return regex.test(location.hostname)
}


export const ReactiveSettings = $state({
    screenShotMode: false,
    isGithubPages: isInGithub(),
    lang: getCurrentSupportedLang(),
})

export function updateDocumentLanguage() {
    // Atualizar o atributo Lang da pagina
    if (typeof document !== 'undefined' && typeof document.documentElement !== 'undefined')
        document.documentElement.lang = ReactiveSettings.lang.code
}
updateDocumentLanguage()
