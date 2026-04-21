export interface Candidate {
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
}

export interface FileRef {
  title: string;
}

export interface ResolvedImage {
  title: string;
  url: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  isAnimated: boolean;
}

export type AppState =
  | { kind: 'idle' }
  | { kind: 'searching'; query: string }
  | { kind: 'results'; query: string; candidates: Candidate[] }
  | { kind: 'galleryLoading'; selected: Candidate }
  | { kind: 'galleryReady'; selected: Candidate; images: ResolvedImage[] }
  | {
      kind: 'error';
      message: string;
      retry?: () => void | Promise<void>;
      previous: AppState;
    };

export type FandomErrorKind = 'rate-limit' | 'network' | 'parse' | 'http';

export class FandomApiError extends Error {
  kind: FandomErrorKind;
  retryAfter?: number;
  status?: number;
  constructor(kind: FandomErrorKind, message: string, opts?: { retryAfter?: number; status?: number }) {
    super(message);
    this.kind = kind;
    this.retryAfter = opts?.retryAfter;
    this.status = opts?.status;
  }
}
