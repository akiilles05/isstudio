const items = [
  "Teljesen reszponzív",
  "Keresőoptimalizált",
  "Villámgyors betöltés",
  "Modern dizájn",
  "Átlátható folyamat",
  "Magyar KKV-knak",
  "Gyors átadás",
];

export default function MarqueeSection() {
  const all = [...items, ...items];

  return (
    <div className="overflow-hidden border-t border-b border-[rgba(255,255,255,0.05)] py-3.5 bg-[rgba(76,124,248,0.025)]">
      <div className="flex w-max animate-[ticker_32s_linear_infinite]">
        {all.map((item, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="px-9 text-[11px] text-[#5e7090] tracking-[0.09em] uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="text-[#4c7cf8] text-lg leading-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
