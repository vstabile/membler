import { writable } from 'svelte/store';
import { type Message } from '$lib/db';

const currentPost = writable<Message | null>(null);

export default currentPost;
