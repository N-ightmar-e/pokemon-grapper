function NpcSprite() {
  // 16x24 pixel "dev trainer" sprite rendered as SVG rects.
  // palette: skin #f2c79a, hair #1a1a1a, cap #0f172a, capBrim #1e40af,
  // glasses #111, shirt #38bdf8, shirtDark #0284c7, pants #1f2937, shoes #111,
  // outline #0d1117
  const P = {
    skin: '#f2c79a',
    hair: '#1a1a1a',
    cap: '#0f172a',
    capBrim: '#1e40af',
    glass: '#111827',
    eye: '#ffffff',
    shirt: '#38bdf8',
    shirtDark: '#0284c7',
    pants: '#1f2937',
    shoes: '#111',
    outline: '#0b0f16',
  };
  // 16 cols x 24 rows, '.' = transparent
  const rows = [
    '................',
    '.....CCCCCC.....',
    '....CBBBBBBC....',
    '...CBBBBBBBBC...',
    '...CBBBBBBBBC...',
    '...CHHHHHHHHC...',
    '...CHSSSSSSHC...',
    '...HSSGGSGSSH...',
    '...HSSWKSWKSH...',
    '...HSSGGSGGSH...',
    '...HSSSSSSSSH...',
    '....HSSSMMSH....',
    '.....HHHHHH.....',
    '.....TTTTTT.....',
    '....TTTTTTTT....',
    '...TTtttttTTT...',
    '...TTtttttTTT...',
    '....TTTTTTTT....',
    '....TT.PP.TT....',
    '....PP.PP.PP....',
    '....PP.PP.PP....',
    '....PP.PP.PP....',
    '...OOO.OOOO.....',
    '...OOO.OOOO.....',
  ];
  const colorFor: Record<string, string> = {
    C: P.cap,
    B: P.capBrim,
    H: P.hair,
    S: P.skin,
    G: P.glass,
    W: P.eye,
    K: P.eye,
    M: P.hair,
    T: P.shirt,
    t: P.shirtDark,
    P: P.pants,
    O: P.shoes,
  };

  const rects: React.ReactElement[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      const color = colorFor[ch];
      if (!color) continue;
      rects.push(
        <rect key={`${x},${y}`} x={x} y={y} width={1} height={1} fill={color} />
      );
      // add subtle outline: bottom edge darker
      if (ch === 'T' && y === rows.length - 10) {
        rects.push(
          <rect key={`o-${x},${y}`} x={x} y={y + 1} width={1} height={0.3} fill={P.outline} opacity={0.25} />
        );
      }
    }
  });

  return (
    <svg
      viewBox="0 0 16 24"
      width={96}
      height={144}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      className="drop-shadow-[0_4px_0_rgba(0,0,0,0.55)]"
      aria-label="제작자 NPC"
    >
      {rects}
    </svg>
  );
}

function BangBubble() {
  return (
    <div className="relative -mb-1 animate-npc-bounce">
      <svg
        viewBox="0 0 12 14"
        width={36}
        height={42}
        shapeRendering="crispEdges"
        style={{ imageRendering: 'pixelated' }}
        aria-hidden
      >
        {/* yellow rounded rect with black border, red '!' */}
        {/* border top */}
        <rect x="2" y="0" width="8" height="1" fill="#0b0f16" />
        <rect x="1" y="1" width="10" height="1" fill="#0b0f16" />
        <rect x="0" y="2" width="1" height="8" fill="#0b0f16" />
        <rect x="11" y="2" width="1" height="8" fill="#0b0f16" />
        <rect x="1" y="10" width="10" height="1" fill="#0b0f16" />
        <rect x="2" y="11" width="8" height="1" fill="#0b0f16" />
        {/* yellow fill */}
        <rect x="2" y="1" width="8" height="10" fill="#fde047" />
        <rect x="1" y="2" width="10" height="8" fill="#fde047" />
        {/* highlight */}
        <rect x="2" y="2" width="2" height="1" fill="#fef9c3" />
        <rect x="2" y="3" width="1" height="4" fill="#fef9c3" />
        {/* red '!' */}
        <rect x="5" y="3" width="2" height="4" fill="#dc2626" />
        <rect x="5" y="8" width="2" height="1" fill="#dc2626" />
        {/* tail */}
        <rect x="5" y="12" width="2" height="1" fill="#0b0f16" />
        <rect x="5" y="12" width="2" height="1" fill="#0b0f16" />
        <rect x="5" y="12" width="1" height="1" fill="#0b0f16" />
      </svg>
    </div>
  );
}

export function NpcNotice() {
  return (
    <div className="flex w-full flex-col items-center gap-4 select-none">
      <div className="pokemon-dialog relative w-full max-w-2xl">
        <div className="pokemon-dialog-inner">
          <p className="pokemon-dialog-title">
            ⚠ 쓰기 전에 한 번 읽어주세요!
          </p>
          <p>
            여기서 받는 이미지의 저작권은 전부
            <br className="hidden sm:inline" />
            <b> The Pokémon Company / Nintendo / Game Freak / Creatures Inc.</b> 한테 있어요.
          </p>
          <p>
            Fandom 위키에 팬이 올린 자료를 그대로 가져올 뿐이라,
            재배포·상업 이용·굿즈 제작·NFT·팬게임 리소스·유료 콘텐츠 등에 쓰면
            <b> 법적으로 문제될 수 있습니다.</b>
          </p>
          <p>
            본인 감상이나 공부 용도로만 <b>알아서 조심해서</b> 써주세요.
            제작자는 사용자의 오남용에 <b>어떤 법적 책임도 지지 않습니다.</b>
          </p>
          <p className="pokemon-dialog-prompt">▼</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <BangBubble />
        <div className="animate-npc-idle">
          <NpcSprite />
        </div>
        <div className="mt-2 text-center font-mono text-[11px] uppercase tracking-widest text-slate-400">
          제작자 · Oh-Nightmare
        </div>
      </div>
    </div>
  );
}
