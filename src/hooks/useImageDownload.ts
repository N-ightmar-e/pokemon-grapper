import { useState, useCallback } from 'react';
import type { ResolvedImage } from '../types/pokemon';
import { downloadAsWebp } from '../utils/webp';
import { saveBlob } from '../utils/download';
import { buildDownloadName } from '../utils/filename';

export type DownloadStatus = 'idle' | 'working' | 'done' | 'error';

export interface UseImageDownload {
  status: DownloadStatus;
  error: string | null;
  trigger: (img: ResolvedImage) => Promise<void>;
}

export function useImageDownload(): UseImageDownload {
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const trigger = useCallback(async (img: ResolvedImage) => {
    setStatus('working');
    setError(null);
    try {
      const { blob, ext } = await downloadAsWebp(img);
      saveBlob(blob, buildDownloadName(img.title, ext));
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, []);

  return { status, error, trigger };
}
