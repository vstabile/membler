import type { NDKEvent } from '@nostr-dev-kit/ndk';
import { writable } from 'svelte/store';

export type Theme = {
	id: string;
	brandColor: string;
	onboardingColor?: string;
	onboardingBgColor?: string;
	buttonTextColor?: string;
	headerBgColor?: string;
	headerTextColor?: string;
	sidebarBgColor?: string;
	sidebarTextColor?: string;
	sidebarBorderColor?: string;
	itemActiveColor?: string;
	itemActiveTextColor?: string;
	itemHoverColor?: string;
};

type ThemeTemplate = Omit<Theme, 'id'>;

export const defaultTheme = {
	brandColor: '#2b2e33',
	onboardingColor: '#581c87',
	onboardingBgColor: '#f3e8ff',
	buttonTextColor: '#ffffff',
	headerBgColor: '#ffffff',
	headerTextColor: '#545861',
	sidebarBgColor: '#ffffff',
	sidebarTextColor: '#545861',
	sidebarBorderColor: '#e4e7eb',
	itemActiveColor: '#506cf0',
	itemActiveTextColor: '#ffffff',
	itemHoverColor: '#f0f3f5'
};

const isBrowser = typeof window !== 'undefined';

export function applyTheme(theme: ThemeTemplate): void {
	if (!isBrowser) return;

	document.documentElement.style.setProperty('--brand-color', theme.brandColor);
	document.documentElement.style.setProperty(
		'--button-text-color',
		theme.buttonTextColor ?? defaultTheme.buttonTextColor
	);
	document.documentElement.style.setProperty(
		'--onboarding-color',
		theme.onboardingColor ?? theme.brandColor ?? defaultTheme.onboardingColor
	);
	document.documentElement.style.setProperty(
		'--onboarding-bg-color',
		theme.onboardingBgColor ?? defaultTheme.onboardingBgColor
	);
	document.documentElement.style.setProperty(
		'--header-bg-color',
		theme.headerBgColor ?? defaultTheme.headerBgColor
	);
	document.documentElement.style.setProperty(
		'--header-text-color',
		theme.headerTextColor ?? defaultTheme.headerTextColor
	);
	document.documentElement.style.setProperty(
		'--sidebar-bg-color',
		theme.sidebarBgColor ?? defaultTheme.sidebarBgColor
	);
	document.documentElement.style.setProperty(
		'--sidebar-text-color',
		theme.sidebarTextColor ?? defaultTheme.sidebarTextColor
	);
	document.documentElement.style.setProperty(
		'--sidebar-border-color',
		theme.sidebarBorderColor ?? defaultTheme.sidebarBorderColor
	);
	document.documentElement.style.setProperty(
		'--item-active-color',
		theme.itemActiveColor ?? theme.brandColor ?? defaultTheme.itemActiveColor
	);
	document.documentElement.style.setProperty(
		'--item-active-text-color',
		theme.itemActiveTextColor ?? theme.buttonTextColor ?? defaultTheme.itemActiveTextColor
	);
	document.documentElement.style.setProperty(
		'--item-hover-color',
		theme.itemHoverColor ?? defaultTheme.itemHoverColor
	);
}

function createThemes() {
	const { set, subscribe, update } = writable<Theme[]>();

	set([]);

	return {
		subscribe,
		getThemeById: (id: string): ThemeTemplate => {
			let themes: Theme[] = [];
			subscribe((value) => {
				if (value) themes = value;
			})();
			let theme = themes.find((t) => t.id === id);
			theme = theme ? theme : { ...defaultTheme, id: '0' };
			applyTheme(theme);
			return theme;
		},
		updateTheme: (id: string, theme: ThemeTemplate) => {
			// Update the themes in this store
			update((themes) => {
				const index = themes.findIndex((t) => t.id === id);
				if (index !== -1) {
					themes[index] = { ...theme, id };
				} else {
					themes.push({ ...theme, id });
				}

				return themes;
			});

			applyTheme(theme);
		},
		applyThemeEvent: (event: NDKEvent) => {
			const theme = event.tags.reduce((acc, tag) => {
				const key = tag[0];
				if (key in defaultTheme) {
					acc[key as keyof ThemeTemplate] = tag[1];
				}
				return acc;
			}, {} as ThemeTemplate);

			const id = event.tags
				.find((t) => t[0] === 'd' && t[1].startsWith('membler:theme:'))?.[1]
				.split(':')[2];

			if (!id) return;

			update((themes) => {
				const index = themes.findIndex((t) => t.id === id);
				if (index !== -1) {
					themes[index] = { ...theme, id };
				} else {
					themes.push({ ...theme, id });
				}

				return themes;
			});

			applyTheme(theme);
		}
	};
}

const themes = createThemes();

export default themes;
