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

        // Não possui algum dos atributos de lang code suportados
        return false
    }

    return true
}

function convertToString(item: any): string { 
    switch (typeof item) {
        case 'number':
            return item.toString()

        case 'string':
            return item

        case 'object': 
            return isLocalizedString(item) 
                ? getLocalizedString(item) 
                : JSON.stringify(item)

        default:
            return ''
    }
}


export function getAppropriatedString(obj: string | LocalizedString, ...format: any[]): string {
    let result = convertToString(obj)

    // Formatar a string
    for (const item of format) {
        const toFormat = convertToString(item)
        result = result.replace(/%s/, toFormat)
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