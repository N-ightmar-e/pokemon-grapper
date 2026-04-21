export function stripFilePrefix(title: string): string {
  return title.replace(/^(파일|File|Image):/, '');
}

export function stripExtension(name: string): string {
  return name.replace(/\.[a-z0-9]{2,5}$/i, '');
}

export function sanitizeFilename(raw: string): string {
  return raw
    .replace(/[/\\?%*:|"<>]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

export function buildDownloadName(title: string, ext: string): string {
  const base = sanitizeFilename(stripExtension(stripFilePrefix(title)));
  return `${base}.${ext}`;
}
