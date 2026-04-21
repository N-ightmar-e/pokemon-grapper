import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';

interface Props {
  initialValue?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function SearchBar({ initialValue = '', onSubmit, disabled }: Props) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <input
          data-testid="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="포켓몬 이름을 한글로 입력하세요 (예: 피카츄)"
          disabled={disabled}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-base text-slate-100 outline-none transition focus:border-sky-500 disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        data-testid="search-submit"
        disabled={disabled || !value.trim()}
        className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        검색
      </button>
    </form>
  );
}
