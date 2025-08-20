import { extractHSL, hslToHex } from "$lib/utils/color-util";
import type { MemberType } from "$lib/utils/reactive-database.svelte";

export enum Fragments {
    UNDEFINED = 0,
    MANAGE_ORGANIZATION = 1,
    MANAGE_TEAMS = 2,
    COMMISSIONS = 3,
    AUDIT_LOG = 4,
}



function getVariableColorInHex(computedStyles: CSSStyleDeclaration, variable: string) {
    const value = computedStyles.getPropertyValue(variable).trim()
    if (value.startsWith('#'))
        return value.substring(1)

    if (value.startsWith('hsl'))
        return hslToHex(extractHSL(value), false)

    return '#000000'
}

export function getPlaceholderImageUrl(computedStyles: CSSStyleDeclaration, member: MemberType) {
    const firstChar = encodeURIComponent(member.name.trim().charAt(0))
    const colorBG = getVariableColorInHex(computedStyles, '--mdc-theme-secondary')
    const colorText = getVariableColorInHex(computedStyles, '--mdc-theme-on-secondary')

    return `url(https://placehold.co/72x72/${colorBG}/${colorText}?font=roboto&text=${firstChar})`
}