import { z } from 'zod';
import { nip19 } from 'nostr-tools';

export const nsecSchema = z.object({
	key: z
		.string()
		.startsWith('nsec1')
		.length(5 + 58)
		.refine(
			(key) => {
				try {
					const result = nip19.decode(key);
					return result.type === 'nsec';
				} catch (e) {
					return false;
				}
			},
			{
				message: 'This is not a valid nsec key'
			}
		)
});
