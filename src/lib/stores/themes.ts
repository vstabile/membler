import { writable } from 'svelte/store';

type Theme = {
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

const defaultTheme = {
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

const mockThemes: Theme[] = [
	{
		id: 'a',
		brandColor: '#ff5e84',
		onboardingBgColor: '#ffe9ee',
		buttonTextColor: '#ffffff',
		headerBgColor: '#F7F9FA',
		sidebarBgColor: '#01163F',
		sidebarTextColor: '#ECE7F6',
		sidebarBorderColor: '#022871',
		itemActiveColor: '#745AF8',
		itemActiveTextColor: '#ffffff',
		itemHoverColor: '#012B6B'
	},
	{
		id: 'b',
		brandColor: '#0f144c',
		buttonTextColor: '#ffffff'
	},
	{
		id: 'c',
		brandColor: '#2b2e33',
		buttonTextColor: '#ffffff',
		headerTextColor: '545861',
		sidebarBgColor: '#ffffff',
		sidebarTextColor: '#545861',
		itemActiveColor: '#506cf0',
		itemActiveTextColor: '#ffffff',
		itemHoverColor: '#f0f3f5'
	}
];

function createThemes() {
	const { subscribe, set } = writable<Theme[]>();

	set(mockThemes);

	const isBrowser = typeof window !== 'undefined';

	const applyTheme = (theme: ThemeTemplate) => {
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
	};

	return {
		subscribe,
		getThemeById: (id: string): ThemeTemplate => {
			let themes: Theme[] = [];
			subscribe((value) => {
				themes = value;
			})();
			let theme = themes.find((t) => t.id === id);
			theme = theme ? theme : { ...defaultTheme, id: '0' };
			applyTheme(theme);
			return theme;
		}
	};
}

const themes = createThemes();

export default themes;
