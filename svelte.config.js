import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Importar as Variáveis de Ambiente
import 'dotenv/config'


/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'docs',
			assets: 'docs',
			fallback: undefined,
			precompress: false,
			strict: true,
			fallback: '200.html'
		}),
		prerender: { handleMissingId: 'warn' }
	}
};
