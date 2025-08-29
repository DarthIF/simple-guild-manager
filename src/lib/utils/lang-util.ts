export const SUPPORTED_LANGS = [
    {
        code: 'en'
    },
    {
        code: 'pt'
    }
]

export function getCurrentSupportedLang() {
    const lang = navigator.language.split('-')[0]
    if (lang === 'pt')
        return SUPPORTED_LANGS[1]

    return SUPPORTED_LANGS[0]
}