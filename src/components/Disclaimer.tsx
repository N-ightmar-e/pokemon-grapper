import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div
      role="alert"
      className="w-full rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-100 sm:text-sm"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
        <div>
          <div className="mb-1 font-bold text-amber-200">⚠️ 쓰기 전에 한 번 읽어주세요</div>
          <p>
            여기서 받는 이미지의 저작권은 전부{' '}
            <strong>The Pokémon Company / Nintendo / Game Freak / Creatures Inc.</strong> 한테 있어요.
            Fandom 위키에 팬이 올린 자료를 그대로 가져올 뿐이라, 재배포·상업적 이용·굿즈 제작·
            NFT·팬게임 리소스·유료 콘텐츠 등에 쓰면 <strong>법적으로 문제될 수 있습니다.</strong>
            본인 감상이나 공부 용도로만, 본인 책임 아래 알아서 조심해서 써주세요.
          </p>
          <p className="mt-1.5 text-amber-200/80">
            이 도구는 그냥 만들어 본 것뿐이고, 사용자가 어떻게 쓰는지에 대해서{' '}
            <strong>제작자는 어떤 법적 책임도 지지 않습니다.</strong> 문제가 생기면 쓴 사람 본인 몫.
          </p>
        </div>
      </div>
    </div>
  );
}
