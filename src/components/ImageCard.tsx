import { useState } from 'react';
import { Download, ExternalLink, Check, AlertTriangle, Loader2 } from 'lucide-react';
import type { ResolvedImage } from '../types/pokemon';
import { stripFilePrefix, stripExtension } from '../utils/filename';
import { useImageDownload } from '../hooks/useImageDownload';

interface Props {
  image: ResolvedImage;
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function ImageCard({ image }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const { status, error, trigger } = useImageDownload();

  const displayName = stripExtension(stripFilePrefix(image.title));
  const outputExt = image.isAnimated ? 'GIF' : 'WEBP';

  const buttonLabel = (() => {
    switch (status) {
      case 'working':
        return (
          <>
            <Loader2 size={14} className="animate-spin" /> 변환 중…
          </>
        );
      case 'done':
        return (
          <>
            <Check size={14} /> 저장됨
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle size={14} /> 실패
          </>
        );
      default:
        return (
          <>
            <Download size={14} /> {outputExt}로 저장
          </>
        );
    }
  })();

  return (
    <div
      data-testid="image-card"
      data-animated={image.isAnimated}
      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3"
    >
      <div className="checkerboard relative flex h-48 items-center justify-center overflow-hidden rounded-lg">
        {imgFailed ? (
          <div className="p-3 text-center text-xs text-slate-400">이미지를 불러올 수 없습니다</div>
        ) : (
          <img
            src={image.url}
            alt={displayName}
            loading="lazy"
            crossOrigin="anonymous"
            onError={() => setImgFailed(true)}
            className="max-h-full max-w-full object-contain"
          />
        )}
        {image.isAnimated && (
          <span className="absolute right-2 top-2 rounded-md bg-fuchsia-600/90 px-2 py-0.5 text-[10px] font-bold text-white">
            ANIMATED
          </span>
        )}
      </div>

      <div className="flex-1">
        <div className="line-clamp-1 text-sm font-medium text-slate-100" title={displayName}>
          {displayName}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
          <span>
            {image.width}×{image.height}
          </span>
          <span>{image.mime.replace('image/', '')}</span>
          <span>{humanSize(image.size)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => trigger(image)}
          disabled={status === 'working' || imgFailed}
          data-testid="download-button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonLabel}
        </button>
        <a
          href={image.url}
          target="_blank"
          rel="noreferrer"
          title="원본 링크 열기"
          className="flex items-center justify-center rounded-md border border-slate-700 px-2.5 py-2 text-slate-300 transition hover:border-sky-500 hover:text-sky-400"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {error && (
        <div className="text-[11px] text-red-400">
          {error}. 우측 링크로 원본을 직접 받아 주세요.
        </div>
      )}
    </div>
  );
}
