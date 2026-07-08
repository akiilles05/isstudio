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
    <div className="overflow-hidden border-t border-b border-navy/8 py-3.5 bg-accent/3">
      <div className="flex w-max animate-[ticker_32s_linear_infinite]">
        {all.map((item, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="px-9 text-[11px] text-muted tracking-[0.09em] uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="text-accent text-lg leading-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
