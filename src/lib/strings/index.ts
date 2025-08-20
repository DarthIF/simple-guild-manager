export type LocalizedString = {
    en: string
    pt: string
}

export function getAppropriatedString(obj: string | LocalizedString): string {
    if (typeof obj === 'string')
        return obj

    return getLocalizedString(obj)
}

export function getLocalizedString(localizedString: LocalizedString): string {
    const lang = navigator.language.split('-')[0]

    if (Object.prototype.hasOwnProperty.call(localizedString, lang)) {
        // @ts-ignore
        return localizedString[lang]
    }

    return localizedString.en
}
