import { writable } from 'svelte/store';

type Community = {
	id: string;
	name: string;
	icon?: string;
	logo?: string;
	subdomain: string;
};

const mockCommunities: Community[] = [
	{
		id: 'a',
		name: 'Comunidade Micro-SaaS',
		subdomain: 'a',
		icon: 'https://assets.circle.so/2xwyg99ougbzfoa1qe9ikcmzfi04',
		logo: 'https://assets.circle.so/5sh1p5yvgndaup8ppkioo0qkuxy6'
	},
	{
		id: 'b',
		name: 'Próspera City Builders Network',
		subdomain: 'b',
		icon: 'https://app.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCRW91QWdFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--442507973b2e039c83628ee85eb3e82080547602/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNITUdscE9ncHpZWFpsY25zR09ncHpkSEpwY0ZRPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--d6fcae52537a39639a1a2b8c72a020b984e78eaf/Prospera%20Logo%20Arrows@3x.png',
		logo: 'https://app.circle.so/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCQjdXTndFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--228a082f36af5f9840760e7faa587c05d7507055/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNITUdrQ2FBRTZDbk5oZG1WeWV3WTZDbk4wY21sd1ZBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--e7ed929538cfb0e8497fbd036110b7591e89532a/logo-prospera-color@2x.png'
	},
	{
		id: 'c',
		subdomain: 'c',
		name: "Victor's Community"
	}
];

const communities = writable(mockCommunities);

export default communities;
