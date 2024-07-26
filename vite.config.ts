import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import Icons from 'unplugin-icons/vite';

export default ({ mode }) => {
	process.env = {
		...process.env,
		...loadEnv(mode, process.cwd(), '')
	};

	return defineConfig({
		plugins: [
			sveltekit(),
			Icons({
				compiler: 'svelte',
				autoInstall: true
			})
		],
		server: {
			host: '0.0.0.0',
			origin: 'http://membler.local',
			port: parseInt(process.env.VITE_PORT || '3030', 10) || 3030
		}
	});
};
