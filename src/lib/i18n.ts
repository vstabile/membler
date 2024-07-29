import i18n, { type Config } from 'sveltekit-i18n';
import session from '$lib/stores/session';

/** @type {import('sveltekit-i18n').Config} */
const config: Config<{ value?: number }, {}> = {
	initLocale: 'en',
	loaders: [
		{
			locale: 'en',
			key: '',
			loader: async () => (await import('./locales/en.json')).default
		},
		{
			locale: 'pt',
			key: '',
			loader: async () => (await import('./locales/pt.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

session.subscribe((s) => {
	loadTranslations(s.locale);
});
