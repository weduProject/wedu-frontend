import { useState } from 'react';
import clsx from 'clsx';

// 취향 태그
const TASTE_OPTIONS = [
  { emoji: '🌷', label: '꽃과 장미' },
  { emoji: '🕯️', label: '캔들 무드' },
  { emoji: '🍷', label: '와인&샴페인' },
  { emoji: '🎵', label: '라이브 음악' },
  { emoji: '📷', label: '사진 촬영' },
  { emoji: '🎂', label: '케이크&디저트' },
  { emoji: '🎈', label: '풍선 데코' },
  { emoji: '💌', label: '손편지' },
  { emoji: '👑', label: '럭셔리 패키지' },
  { emoji: '🌿', label: '자연 속에서' },
  { emoji: '🐶', label: '반려동물과 함께' },
  { emoji: '🎬', label: '영상 편지' },
];

export default function TasteFinder() {
  // 다중 선택 가능 (여러 취향 조합)
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label],
    );
  };

  return (
    <section className="rounded-2xl border border-[#EAE4D8] bg-white p-8">
      <h2 className="mb-2 text-xl font-bold text-[#0D0A09]">취향으로 찾기</h2>
      <p className="mb-6 text-sm text-[#7C6358]">
        원하는 분위기나 요소를 선택하면 딱 맞는 상품을 추천해 드려요
      </p>

      <div className="flex flex-wrap gap-2">
        {TASTE_OPTIONS.map(({ emoji, label }) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              aria-pressed={active}
              className={clsx(
                'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors',
                active
                  ? 'border-[#FC4A4D] bg-[#FC4A4D] text-white'
                  : 'border-[#EAE4D8] bg-[#FAF8F4] text-[#5C4940] hover:border-[#FC4A4D]/40',
              )}
            >
              <span aria-hidden>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}