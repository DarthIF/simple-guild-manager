import adapterStatic from '@sveltejs/adapter-static'
import adapterVercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import 'dotenv/config' // Importar as Variáveis de Ambiente


/**
 * Create appropriate svelte adapter for the webapp
 * 
 * @returns {import('@sveltejs/kit').Adapter}
 */
function createAdapter() {
	// Adaptador para o Vercel
	if (!process.env.FORCE_STATIC && process.env.ENABLE_VERCEL_MODE === 'yes') {
		return adapterVercel({})
	}

	// Adapter para o modo estático
	return adapterStatic({
		// default options are shown. On some platforms
		// these options are set automatically — see below
		pages: 'docs',
		assets: 'docs',
		fallback: undefined,
		precompress: false,
		strict: true,
		fallback: '200.html'
	})
}


/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: createAdapter(),
		prerender: { handleMissingId: 'warn' }
	},
	onwarn: (warning, handler) => {
		if (warning.code === 'css_unused_selector')
			return;
		handler(warning);
	}
};
