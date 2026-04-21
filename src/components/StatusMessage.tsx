import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  kind: 'loading' | 'empty' | 'error';
  title: string;
  body?: ReactNode;
}

const iconFor = {
  loading: <Loader2 className="animate-spin text-sky-400" size={28} />,
  empty: <Inbox className="text-slate-500" size={28} />,
  error: <AlertCircle className="text-red-400" size={28} />,
};

export function StatusMessage({ kind, title, body }: Props) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-10 text-center"
    >
      {iconFor[kind]}
      <div className="text-base font-medium text-slate-100">{title}</div>
      {body && <div className="text-sm text-slate-400">{body}</div>}
    </div>
  );
}
