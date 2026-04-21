import { create } from 'zustand';
import type { AppState, Candidate } from '../types/pokemon';
import { listPageImages, resolveImageUrls, searchPokemon } from '../api/fandom';
import { FandomApiError } from '../types/pokemon';

interface Store {
  state: AppState;
  search: (query: string) => Promise<void>;
  selectCandidate: (candidate: Candidate) => Promise<void>;
  reset: () => void;
  backToResults: () => void;
}

function errorMessage(err: unknown): string {
  if (err instanceof FandomApiError) {
    switch (err.kind) {
      case 'rate-limit':
        return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
      case 'network':
        return '네트워크 오류입니다. 인터넷 연결을 확인해 주세요.';
      case 'parse':
        return 'Fandom 서버 응답을 해석할 수 없습니다.';
      case 'http':
        return `Fandom 서버 오류 (HTTP ${err.status ?? '알 수 없음'}).`;
    }
  }
  return err instanceof Error ? err.message : String(err);
}

export const useAppStore = create<Store>((set, get) => ({
  state: { kind: 'idle' },

  reset: () => set({ state: { kind: 'idle' } }),

  backToResults: () => {
    const s = get().state;
    if (s.kind === 'galleryReady' || s.kind === 'galleryLoading') {
      // we don't keep the previous candidates list on state, so reset
      set({ state: { kind: 'idle' } });
    } else if (s.kind === 'error' && s.previous.kind === 'results') {
      set({ state: s.previous });
    } else {
      set({ state: { kind: 'idle' } });
    }
  },

  search: async (query: string) => {
    const q = query.trim();
    if (!q) {
      set({ state: { kind: 'idle' } });
      return;
    }
    const searchingState: AppState = { kind: 'searching', query: q };
    set({ state: searchingState });
    try {
      const candidates = await searchPokemon(q);
      set({ state: { kind: 'results', query: q, candidates } });
    } catch (err) {
      set({
        state: {
          kind: 'error',
          message: errorMessage(err),
          retry: () => get().search(q),
          previous: searchingState,
        },
      });
    }
  },

  selectCandidate: async (candidate: Candidate) => {
    const loadingState: AppState = { kind: 'galleryLoading', selected: candidate };
    set({ state: loadingState });
    try {
      const fileRefs = await listPageImages(candidate.title);
      if (fileRefs.length === 0) {
        set({ state: { kind: 'galleryReady', selected: candidate, images: [] } });
        return;
      }
      const images = await resolveImageUrls(fileRefs.map((f) => f.title));
      set({ state: { kind: 'galleryReady', selected: candidate, images } });
    } catch (err) {
      set({
        state: {
          kind: 'error',
          message: errorMessage(err),
          retry: () => get().selectCandidate(candidate),
          previous: loadingState,
        },
      });
    }
  },
}));
