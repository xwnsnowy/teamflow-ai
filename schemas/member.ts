import z from 'zod';

export const inviteMemberSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
});

export type InviteMemberType = z.infer<typeof inviteMemberSchema>;
