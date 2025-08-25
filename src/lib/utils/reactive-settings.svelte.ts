export function getCurrentSupportedLang() {
    const lang = navigator.language.split('-')[0]
    if (lang === 'pt')
        return 'pt'

    return 'en'
}


export const ReactiveSettings = $state({
    screenShotMode: false,
    lang: getCurrentSupportedLang(),
})


