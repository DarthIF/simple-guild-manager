export type LocalizedString = {
    en: string
    pt: string
}

export function getAppropriatedString(localizedString: LocalizedString) {
    const lang = navigator.language.split('-')[0]

    if (Object.prototype.hasOwnProperty.call(localizedString, lang)) {
        // @ts-ignore
        return localizedString[lang]
    }

    return localizedString.en
}