export function getSafeRedirectPath(value: string | null, fallback: string): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }

  const target = new URL(value, 'https://conectapelu2.local');
  return `${target.pathname}${target.search}`;
}
