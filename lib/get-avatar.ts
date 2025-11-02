export function getAvatar(
  userPicture: string | null | undefined,
  userEmail: string | null | undefined,
): string {
  if (typeof userPicture === 'string' && userPicture.trim() !== '') {
    return userPicture;
  }

  if (typeof userEmail === 'string' && userEmail.trim() !== '') {
    return `https://avatar.vercel.sh/${encodeURIComponent(userEmail)}`;
  }

  return 'https://avatar.vercel.sh/unknown';
}
