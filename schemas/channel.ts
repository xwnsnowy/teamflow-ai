import z from 'zod';

export function transformChannelName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-') // thay thế ký tự không phải chữ/số bằng dấu gạch ngang
    .replace(/-{2,}/g, '-') // gộp nhiều dấu gạch ngang liên tiếp thành một
    .replace(/^-+/, '') // loại bỏ dấu gạch ngang ở đầu
    .replace(/-+$/, ''); // loại bỏ dấu gạch ngang ở cuối
}

export const channelNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Channel name must be at least 2 characters')
    .max(50, 'Channel name must be at most 50 characters')
    .transform((name, ctx) => {
      const transfromedName = transformChannelName(name);

      if (transfromedName !== name) {
        ctx.addIssue({
          code: 'custom',
          message: 'Channel name must only contain letters, numbers, and hyphens',
        });
        return z.NEVER;
      }
      return transfromedName;
    }),
});

export type ChannelNameSchemaType = z.infer<typeof channelNameSchema>;
