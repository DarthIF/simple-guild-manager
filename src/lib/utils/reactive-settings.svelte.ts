import { getCurrentSupportedLang } from "./lang-util"


function isInGithub() {
    if (typeof location === 'undefined')
        return false

    const regex = /^[a-zA-Z0-9]+\.github\.io$/g
    return regex.test(location.hostname)
}

export const ReactiveSettings = $state({
    screenShotMode: false,
    isGithubPages: isInGithub(),
    lang: getCurrentSupportedLang(),
})
