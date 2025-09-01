import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: 'https://darthif.github.io/simple-guild-manager/',
	plugins: [sveltekit()]
});
