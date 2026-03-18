import { pushState } from '$app/navigation'
import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
import { getVariableColorInHex } from "$lib/utils/color-util";



export enum Fragments {
    UNDEFINED = '',
    MANAGE_ORGANIZATION = 'manageOrg',
    MANAGE_TEAMS = 'manageTeams',
    COMMISSIONS = 'manageCommissions',
    AUDIT_LOG = 'auditLog',
    SETTINGS = 'settings',
    ABOUT = 'about',
    PROFILE = 'profile',
    ONLINE = 'online'
}

export enum FragmentsParams {
    FRAGMENT = 'fragment',
    EXTRA = 'extra',
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



export function getFragmentForID(fragmentID: string | null | undefined): Fragments {
    if (!fragmentID)
        return Fragments.UNDEFINED

    for (const fragment of Object.values(Fragments)) {
        if (fragment === fragmentID)
            return fragment
    }

    return Fragments.UNDEFINED
}

export function getNavigateURL(fragment: Fragments, extra: string | null | undefined = null) {
    if (typeof window === 'undefined')
        return ''

    if (!extra)
        extra = ''

    const url = new URL(window.location.href)
    url.searchParams.set(FragmentsParams.FRAGMENT, fragment)
    url.searchParams.set(FragmentsParams.EXTRA, extra)

    return url
}

export function navigateToFragment(fragment: Fragments, extra: string | null | undefined = null) {
    const url = getNavigateURL(fragment, extra)

    pushState(url, { fragment, extra })
}

export function navigateToFragmentByHash(hash: string | null | undefined) {
    if (!hash || hash === '' || hash === '#')
        return

    if (hash.startsWith('#'))
        hash = hash.substring(1)

    const split = hash.split("&")
    const fragment = getFragmentForID(split[0])
    const extra = split[1]

    navigateToFragment(fragment, extra)
}



export type FragmentPageState = {
    fragment?: Fragments
    extra?: string | null
}