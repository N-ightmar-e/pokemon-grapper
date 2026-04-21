import type { ResolvedImage } from '../types/pokemon';
import { ImageCard } from './ImageCard';

interface Props {
  images: ResolvedImage[];
}

export function Gallery({ images }: Props) {
  const animated = images.filter((i) => i.isAnimated);
  const still = images.filter((i) => !i.isAnimated);

  return (
    <div className="flex w-full flex-col gap-8">
      {still.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            정적 이미지 <span className="text-slate-600">({still.length})</span>
          </h3>
          <div
            data-testid="still-grid"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {still.map((img) => (
              <ImageCard key={img.title} image={img} />
            ))}
          </div>
        </section>
      )}

      {animated.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            애니메이션 스프라이트 <span className="text-slate-600">({animated.length})</span>
          </h3>
          <div
            data-testid="animated-grid"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {animated.map((img) => (
              <ImageCard key={img.title} image={img} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
