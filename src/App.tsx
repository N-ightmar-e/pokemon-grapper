import { ArrowLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { useAppStore } from './stores/appStore';
import { SearchBar } from './components/SearchBar';
import { CandidateList } from './components/CandidateList';
import { Gallery } from './components/Gallery';
import { StatusMessage } from './components/StatusMessage';
import { Footer } from './components/Footer';

export default function App() {
  const state = useAppStore((s) => s.state);
  const search = useAppStore((s) => s.search);
  const selectCandidate = useAppStore((s) => s.selectCandidate);
  const reset = useAppStore((s) => s.reset);

  const busy = state.kind === 'searching' || state.kind === 'galleryLoading';
  const showingGallery = state.kind === 'galleryLoading' || state.kind === 'galleryReady';

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-400">
            <Sparkles size={14} /> Pokémon Fandom Sprite Grabber
          </div>
          <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">포켓몬 스프라이트 그래버</h1>
          <p className="max-w-xl text-sm text-slate-400">
            한국어 포켓몬 팬덤 위키에서 공식 일러스트와 애니메이션 스프라이트를 찾아
            투명 배경 WebP·GIF로 바로 다운로드하세요.
          </p>
        </header>

        <section className="flex flex-col items-center gap-4">
          <SearchBar
            key={state.kind === 'idle' ? 'idle' : 'active'}
            initialValue={
              state.kind === 'searching' || state.kind === 'results'
                ? state.query
                : state.kind === 'galleryLoading' || state.kind === 'galleryReady'
                ? ''
                : ''
            }
            onSubmit={(v) => search(v)}
            disabled={busy}
          />
          {state.kind !== 'idle' && (
            <button
              type="button"
              onClick={reset}
              data-testid="reset-button"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-sky-400"
            >
              <ArrowLeft size={12} /> 처음으로 돌아가기
            </button>
          )}
        </section>

        <main className="flex flex-1 flex-col items-center gap-6">
          {state.kind === 'idle' && (
            <div className="mt-8 max-w-md text-center text-sm text-slate-500">
              예시: <span className="text-slate-300">피카츄</span> ·{' '}
              <span className="text-slate-300">이상해씨</span> ·{' '}
              <span className="text-slate-300">리자몽</span> ·{' '}
              <span className="text-slate-300">이브이</span>
            </div>
          )}

          {state.kind === 'searching' && (
            <StatusMessage kind="loading" title={`'${state.query}' 검색 중…`} />
          )}

          {state.kind === 'results' && state.candidates.length === 0 && (
            <StatusMessage
              kind="empty"
              title="검색 결과가 없습니다"
              body={<span>다른 이름을 시도해 보세요. 띄어쓰기와 한글 표기를 확인하세요.</span>}
            />
          )}

          {state.kind === 'results' && state.candidates.length > 0 && (
            <div className="w-full">
              <div className="mb-3 text-sm text-slate-400">
                '<span className="text-slate-200">{state.query}</span>' 검색 결과 {state.candidates.length}건
                — 원하는 포켓몬 카드를 클릭해 주세요.
              </div>
              <CandidateList candidates={state.candidates} onSelect={selectCandidate} />
            </div>
          )}

          {showingGallery && (
            <div className="w-full">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">선택된 포켓몬</div>
                  <div className="text-lg font-semibold text-slate-100">{state.selected.title}</div>
                </div>
                <a
                  href={state.selected.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-400 hover:underline"
                >
                  Fandom 페이지 열기 ↗
                </a>
              </div>

              {state.kind === 'galleryLoading' && (
                <StatusMessage kind="loading" title="이미지 목록을 불러오는 중…" />
              )}

              {state.kind === 'galleryReady' && state.images.length === 0 && (
                <StatusMessage
                  kind="empty"
                  title="이 문서에는 사용 가능한 이미지가 없습니다"
                  body={<span>다른 후보를 선택해 주세요.</span>}
                />
              )}

              {state.kind === 'galleryReady' && state.images.length > 0 && (
                <Gallery images={state.images} />
              )}
            </div>
          )}

          {state.kind === 'error' && (
            <StatusMessage
              kind="error"
              title={state.message}
              body={
                <div className="mt-2 flex justify-center gap-2">
                  {state.retry && (
                    <button
                      type="button"
                      onClick={() => state.retry?.()}
                      data-testid="retry-button"
                      className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
                    >
                      <RefreshCcw size={12} /> 재시도
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-sky-500 hover:text-sky-400"
                  >
                    처음으로
                  </button>
                </div>
              }
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
