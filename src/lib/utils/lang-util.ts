export type AppLanguageType = {
    code: string
    name: string
}



export const LANG_ENGLISH: AppLanguageType = {
    code: 'en',
    name: 'English',
}

export const LANG_PORTUGUESE: AppLanguageType = {
    code: 'pt',
    name: 'Português',
}



export const SUPPORTED_LANGS: AppLanguageType[] = [LANG_ENGLISH, LANG_PORTUGUESE]



export function getCurrentSupportedLang(): AppLanguageType {
    const code = navigator.language.split('-')[0]
    const lang = getLangWithCode(code)
    if (lang)
        return lang

    return getDefaultLang()
}

export function getLangWithCode(code: string | null): AppLanguageType | null {
    if (!code)
        return null

    for (const lang of SUPPORTED_LANGS) {
        if (lang.code === code)
            return lang
    }

    return null
}

export function getDefaultLang(): AppLanguageType {
    return LANG_ENGLISH
} 