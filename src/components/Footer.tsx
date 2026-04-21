import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-10 space-y-1 border-t border-slate-800 pt-4 text-center text-[11px] leading-relaxed text-slate-500">
      <div>
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
        (Fandom 위키 텍스트 CC BY-SA 3.0)
      </div>
      <div>
        Pokémon 관련 이미지·명칭의 모든 저작권과 상표권은 The Pokémon Company / Nintendo / Game Freak /
        Creatures Inc. 에 귀속됩니다. 본 도구는 비공식 팬 유틸리티이며 상기 기업들과 무관합니다.
      </div>
      <div className="text-slate-600">
        개인 감상·연구 용도로만 사용하세요. 사용 결과에 대한 모든 책임은 사용자 본인에게 있습니다.
      </div>
    </footer>
  );
}
