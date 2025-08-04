import { snapdom } from '@zumer/snapdom'
import { ReactiveSettings } from './reactive-settings.svelte'


export async function saveElementAsImage(element: HTMLElement, fileName: string) {
    // Ativar o modo de screen shot
    await new Promise((resolve, reject) => {
        ReactiveSettings.screenShotMode = true;
        resolve(null)
    })

    // Renderiza a imagem
    const result = await snapdom(element, { scale: 3 })
    await result.download({ format: 'png', filename: fileName })

    // Desativar o modo de screen shot
    ReactiveSettings.screenShotMode = false
}

