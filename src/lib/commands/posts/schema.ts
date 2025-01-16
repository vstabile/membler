import { z } from 'zod';
import { $t } from 'svelte-i18n';

const postSchema = z.object({
    content: z.string().min(1, $t('post-content-short')).max(3000, $t('post-content-long')),
    channelId: z
        .string({ required_error: $t('invalid-channel-id') })
        .refine((value) => channelIds.includes(value), {
            message: $t('invalid-channel-id')
        })
});

export messageSchema