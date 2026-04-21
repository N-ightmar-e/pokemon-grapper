import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
      이미지 출처:{' '}
      <a
        href="https://pokemon.fandom.com/ko"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-sky-400 hover:underline"
      >
        pokemon.fandom.com/ko
        <ExternalLink size={10} />
      </a>{' '}
      · CC BY-SA 라이선스. 개인 연구·팬메이드 용도로만 사용하세요.
    </footer>
  );
}
