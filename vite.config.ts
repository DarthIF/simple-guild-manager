import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { RemoteDatabase } from '$lib/server/database/server-database.svelte';


// Adicionar o URL do banco de dados
const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}`
RemoteDatabase.setMongoUri(mongoUri)


export default defineConfig({
	plugins: [sveltekit()]
});
