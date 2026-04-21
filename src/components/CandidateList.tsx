import type { Candidate } from '../types/pokemon';
import { ImageIcon } from 'lucide-react';

interface Props {
  candidates: Candidate[];
  onSelect: (c: Candidate) => void;
}

export function CandidateList({ candidates, onSelect }: Props) {
  return (
    <div
      data-testid="candidate-list"
      className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {candidates.map((c) => (
        <button
          key={c.title}
          type="button"
          data-testid="candidate-card"
          data-title={c.title}
          onClick={() => onSelect(c)}
          className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-left transition hover:border-sky-500 hover:bg-slate-800/70"
        >
          <div className="checkerboard flex h-32 items-center justify-center overflow-hidden rounded-lg">
            {c.thumbnail ? (
              <img
                src={c.thumbnail}
                alt={c.title}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <ImageIcon className="text-slate-600" size={32} />
            )}
          </div>
          <div>
            <div className="line-clamp-1 text-sm font-semibold text-slate-100">{c.title}</div>
            {c.description && (
              <div className="mt-0.5 line-clamp-2 text-xs text-slate-400">{c.description}</div>
            )}
          </div>
          <div className="mt-auto text-xs font-medium text-sky-400 opacity-0 transition group-hover:opacity-100">
            이 포켓몬이 맞아요 →
          </div>
        </button>
      ))}
    </div>
  );
}
