import { writable } from 'svelte/store';

type CurrentUser = {
	name: string;
	picture: string;
	about: string;
};

const mockCurrentUser: CurrentUser = {
	name: 'Victor Stabile',
	picture: 'https://assets.circle.so/nanv893y41l5omslt0r7s4tz39bp',
	about: 'I am a software engineer'
};

const CurrentUser = writable(mockCurrentUser);

export default CurrentUser;
