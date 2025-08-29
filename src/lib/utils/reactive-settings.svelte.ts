import { getCurrentSupportedLang, SUPPORTED_LANGS } from "./lang-util"


export const ReactiveSettings = $state({
    screenShotMode: false,
    lang: getCurrentSupportedLang(),
})


