import type { ResolvedImage } from '../types/pokemon';

let webpSupportCache: boolean | null = null;

export function supportsCanvasWebp(): boolean {
  if (webpSupportCache !== null) return webpSupportCache;
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    webpSupportCache = c.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    webpSupportCache = false;
  }
  return webpSupportCache;
}

export function isAnimatedMime(mime: string): boolean {
  return mime === 'image/gif' || mime === 'image/apng';
}

function extensionFromUrl(url: string): string {
  const match = /\.([a-z0-9]{2,5})(?:\?|$|\/)/i.exec(url);
  return match ? match[1].toLowerCase() : 'png';
}

export interface ConvertedImage {
  blob: Blob;
  ext: string;
}

function withOriginalFormat(url: string): string {
  return url.includes('format=original')
    ? url
    : url + (url.includes('?') ? '&' : '?') + 'format=original';
}

export async function downloadAsWebp(src: ResolvedImage): Promise<ConvertedImage> {
  if (isAnimatedMime(src.mime)) {
    const res = await fetch(withOriginalFormat(src.url), { mode: 'cors' });
    if (!res.ok) throw new Error(`이미지 다운로드 실패 (${res.status})`);
    const blob = await res.blob();
    return { blob, ext: src.mime === 'image/apng' ? 'apng' : 'gif' };
  }

  if (!supportsCanvasWebp()) {
    const res = await fetch(src.url, { mode: 'cors' });
    if (!res.ok) throw new Error(`이미지 다운로드 실패 (${res.status})`);
    const blob = await res.blob();
    return { blob, ext: extensionFromUrl(src.url) };
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.referrerPolicy = 'no-referrer';
  img.src = src.url;
  try {
    await img.decode();
  } catch (err) {
    throw new Error(`이미지 디코드 실패: ${err instanceof Error ? err.message : String(err)}`);
  }

  const w = img.naturalWidth || src.width;
  const h = img.naturalHeight || src.height;
  if (!w || !h) throw new Error('이미지 크기를 읽을 수 없습니다.');

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 컨텍스트를 생성할 수 없습니다.');
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('canvas.toBlob이 null을 반환했습니다.'))),
      'image/webp',
      1.0
    );
  });
  return { blob, ext: 'webp' };
}
