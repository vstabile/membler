import Dexie, { type EntityTable } from 'dexie';

interface Profile {
	pubkey: string;
	name?: string;
	picture?: string;
	about?: string;
	updatedAt: number;
	mutedAt?: number;
}

interface Message {
	id: string;
	communityId: string;
	channelId: string;
	replyTo?: string;
	title?: string;
	content: string;
	pubkey: string;
	comments: number;
	likes: number;
	createdAt: number;
	hiddenAt?: number;
	deletedAt?: number;
}

interface Link {
	id?: number;
	author: string;
	communityId: string;
	title: string;
	url: string;
	createdAt: number;
}

interface Member {
	pubkey: string;
	invitedBy: string[];
	name?: string;
	picture?: string;
	isModerator?: boolean;
}

const db = new Dexie('Database') as Dexie & {
	profiles: EntityTable<Profile, 'pubkey'>;
	messages: EntityTable<Message, 'id'>;
	links: EntityTable<Link>;
};

db.version(1).stores({
	profiles: 'pubkey, updatedAt',
	messages: 'id, replyTo, createdAt',
	links: '++id, communityId, [communityId+author], createdAt'
});

export type { Profile, Message, Link };
export default db;
