import { getCurrentSupportedLang } from "$lib/utils/reactive-settings.svelte"

export type LocalizedString = {
    en: string
    pt: string
}

export const SUPPORTED_LANGS = [
    {
        code: 'en'
    },
    {
        code: 'pt'
    }
]

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
        if (isLocalizedString(item))
            str = getLocalizedString(item)
        else
            str = item

        result = result.replace(/%s/, str)
    }

    return result
}

export function getLocalizedString(localizedString: LocalizedString): string {
    const lang = getCurrentSupportedLang()
    return localizedString[lang]
}
