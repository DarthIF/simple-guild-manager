import { getCurrentSupportedLang, SUPPORTED_LANGS } from "$lib/utils/lang-util"
import { ReactiveSettings } from "$lib/client/settings.svelte";

export type LocalizedString = {
    en: string
    pt: string
}


function isLocalizedString(obj: any) {
    for (const lang of SUPPORTED_LANGS) {

        if (Object.prototype.hasOwnProperty.call(obj, lang.code))
            continue

        return false
    }

    return true
}


export function getAppropriatedString(obj: string | LocalizedString, ...format: any[]): string {
    let result: string
    if (typeof obj === 'string')
        result = obj
    else
        result = getLocalizedString(obj)

    // Formatar a string
    for (const item of format) {
        let str: string
        if (item && isLocalizedString(item))
            str = getLocalizedString(item)
        else if (item)
            str = item
        else
            str = ''

        result = result.replace(/%s/, str)
    }

    return result
}

export function getLocalizedString(localizedString: LocalizedString): string { 
    /**
     * Usar a variável `ReactiveSettings` dentro dessa função irá fazer o texto atualizar 
     * automaticamente em um componente quando a linguagem muda por estar em um contexto reativo
     */
    const lang = ReactiveSettings.lang 

    // @ts-expect-error
    return localizedString[lang.code]
}


export function alertWith(obj: string | LocalizedString, ...format: any[]) {
    const message = getAppropriatedString(obj, ...format)
    return alert(message)
}

export function confirmWith(obj: string | LocalizedString, ...format: any[]) {
    const message = getAppropriatedString(obj, ...format)
    return confirm(message)
} 