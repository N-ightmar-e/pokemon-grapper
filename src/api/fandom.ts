import type { Candidate, FileRef, ResolvedImage } from '../types/pokemon';
import { fetchJson } from './httpClient';

const BASE = 'https://pokemon.fandom.com/ko/api.php';

type OpenSearchResp = [string, string[], string[], string[]];

interface PageImagesResp {
  query?: {
    pages?: Array<{
      pageid?: number;
      title: string;
      thumbnail?: { source: string; width: number; height: number };
      pageimage?: string;
    }>;
  };
}

interface ImagesOnPageResp {
  query?: {
    pages?: Array<{
      title: string;
      images?: Array<{ title: string }>;
    }>;
  };
}

interface ImageInfoResp {
  query?: {
    pages?: Array<{
      title: string;
      missing?: boolean;
      imageinfo?: Array<{
        url: string;
        mime: string;
        size: number;
        width: number;
        height: number;
      }>;
    }>;
  };
}

function buildUrl(params: Record<string, string>): string {
  const search = new URLSearchParams({
    format: 'json',
    formatversion: '2',
    origin: '*',
    ...params,
  });
  return `${BASE}?${search.toString()}`;
}

function buildPostBody(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams({
    format: 'json',
    formatversion: '2',
    origin: '*',
    ...params,
  });
}

const NON_IMAGE_TITLE = /\.(ogg|oga|mp3|wav|ogv|webm|mp4|pdf|svg)$/i;
const LOGO_ICON_TITLE = /(wikia|wiki|wordmark|site|favicon|logo|icon|placeholder)/i;

function stripFilePrefix(title: string): string {
  return title.replace(/^(파일|File|Image):/, '');
}

export async function searchPokemon(name: string): Promise<Candidate[]> {
  const trimmed = name.trim();
  if (!trimmed) return [];

  const opensearchUrl = buildUrl({
    action: 'opensearch',
    search: trimmed,
    limit: '5',
    namespace: '0',
  });

  const [, titles, descriptions, urls] = await fetchJson<OpenSearchResp>(opensearchUrl);

  if (!titles || titles.length === 0) return [];

  const thumbsUrl = buildUrl({
    action: 'query',
    titles: titles.join('|'),
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '240',
  });

  const thumbResp = await fetchJson<PageImagesResp>(thumbsUrl);
  const thumbMap = new Map<string, string>();
  thumbResp.query?.pages?.forEach((p) => {
    if (p.thumbnail?.source) thumbMap.set(p.title, p.thumbnail.source);
  });

  return titles.map((title, i) => ({
    title,
    description: descriptions?.[i],
    url: urls?.[i] ?? '',
    thumbnail: thumbMap.get(title),
  }));
}

export async function listPageImages(title: string): Promise<FileRef[]> {
  const url = buildUrl({
    action: 'query',
    titles: title,
    prop: 'images',
    imlimit: 'max',
  });
  const resp = await fetchJson<ImagesOnPageResp>(url);
  const page = resp.query?.pages?.[0];
  const images = page?.images ?? [];
  return images
    .filter((im) => !NON_IMAGE_TITLE.test(stripFilePrefix(im.title)))
    .filter((im) => !LOGO_ICON_TITLE.test(stripFilePrefix(im.title)))
    .map((im) => ({ title: im.title }));
}

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);

async function resolveChunk(titles: string[]): Promise<ResolvedImage[]> {
  if (titles.length === 0) return [];
  const body = buildPostBody({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
  });
  const resp = await fetchJson<ImageInfoResp>(BASE, { method: 'POST', body });
  const pages = resp.query?.pages ?? [];
  const out: ResolvedImage[] = [];
  for (const p of pages) {
    if (p.missing) continue;
    const info = p.imageinfo?.[0];
    if (!info) continue;
    if (!ALLOWED_MIME.has(info.mime)) continue;
    out.push({
      title: p.title,
      url: info.url,
      mime: info.mime,
      width: info.width,
      height: info.height,
      size: info.size,
      isAnimated: info.mime === 'image/gif',
    });
  }
  return out;
}

export async function resolveImageUrls(titles: string[]): Promise<ResolvedImage[]> {
  const chunkSize = 50;
  const chunks: string[][] = [];
  for (let i = 0; i < titles.length; i += chunkSize) {
    chunks.push(titles.slice(i, i + chunkSize));
  }
  const results = await Promise.all(chunks.map((c) => resolveChunk(c)));
  return results.flat();
}
