import { getCurrentSupportedLang } from "$lib/utils/reactive-settings.svelte"

export type LocalizedString = {
    en: string
    pt: string
}

export function getAppropriatedString(obj: string | LocalizedString, ...format: any[]): string {
    let result: string
    if (typeof obj === 'string')
        result = obj
    else
        result = getLocalizedString(obj)

    // Formatar a string
    for (const item of format) {
        result = result.replace(/%s/, item)
    }

    return result
}

export function getLocalizedString(localizedString: LocalizedString): string {
    const lang = getCurrentSupportedLang()
    return localizedString[lang]
}
