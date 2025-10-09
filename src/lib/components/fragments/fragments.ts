import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
import { extractHSL, hslToHex, getVariableColorInHex } from "$lib/utils/color-util";

export enum Fragments {
    UNDEFINED = '',
    MANAGE_ORGANIZATION = '#manageOrg',
    MANAGE_TEAMS = '#manageTeams',
    COMMISSIONS = '#manageCommissions',
    AUDIT_LOG = '#auditLog',
    SETTINGS = '#settings',
    ABOUT = '#about',
}


export function getPlaceholderImageUrl(computedStyles: CSSStyleDeclaration, member: MemberTypeV3) {
    const firstChar = encodeURIComponent(member.name.trim().charAt(0))
    const colorBG = getVariableColorInHex(computedStyles, '--mdc-theme-secondary')
    const colorText = getVariableColorInHex(computedStyles, '--mdc-theme-on-secondary')

    return `url(https://placehold.co/72x72/${colorBG}/${colorText}?font=roboto&text=${firstChar})`
}

export function getPlaceHolderStyle(computedStyles: CSSStyleDeclaration, member: MemberTypeV3, cssVariable: string = '--bg') {
    const cssUrl = getPlaceholderImageUrl(computedStyles, member)
    return `${cssVariable}: ${cssUrl}`
} 