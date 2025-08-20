export type ColorListItem = {
    name: string
    surface: string
    text_primary: string
    text_secondary: string
}


export const COLOR_LIST: ColorListItem[] = [
    {
        name: 'Light Moss Green',
        surface: '#b6d7a8',
        text_primary: '#274e13',
        text_secondary: '#274e13'
    },
    {
        name: "Peach-Orange",
        surface: "#f9cb9c",
        text_primary: "#783f04",
        text_secondary: "#783f04"
    },
    {
        name: "Pastel Blue",
        surface: "#a2c4c9",
        text_primary: "#0c343d",
        text_secondary: "#0c343d"
    },
    {
        name: "Flavescent",
        surface: "#ffe599",
        text_primary: "#7f6000",
        text_secondary: "#7f6000"
    },
    {
        name: "Ruddy Pink",
        surface: "#ea9999",
        text_primary: "#660000",
        text_secondary: "#660000"
    },
    {
        name: "Baby Blue Eyes",
        surface: "#a4c2f4",
        text_primary: "#1c4587",
        text_secondary: "#1c4587"
    },
    {
        name: "Light Pastel Purple",
        surface: "#b4a7d6",
        text_primary: "#20124d",
        text_secondary: "#20124d"
    },
    {
        name: "Lilac",
        surface: "#d5a6bd",
        text_primary: "#4c1130",
        text_secondary: "#4c1130"
    }
]


export function getColorListItemForIndex(index: number): ColorListItem {
    const size = COLOR_LIST.length
    const target = index % size

    return COLOR_LIST[target]
}


export function applyColorVariables(element: HTMLElement, color: ColorListItem) {
    element.style.setProperty('--mdc-theme-surface', color.surface)
    element.style.setProperty('--mdc-theme-text-primary-on-background', color.text_primary)
    element.style.setProperty('--mdc-theme-text-secondary-on-background', color.text_secondary)
}

