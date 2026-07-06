import type { ProcessStep } from "@/types";

export default function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  return (
    <section id="folyamat" className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-[72px]">
          <p className="text-[11px] font-medium text-[#4c7cf8] tracking-[0.1em] uppercase mb-4">Hogyan dolgozunk</p>
          <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-[#eef2ff] leading-[1.05]">
            Az első üdvözléstől
            <br />
            az élő weboldalig.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {steps.map((step, i) => {
            const col = i % 2;
            return (
              <div
                key={step.id}
                className={`px-9 py-10 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-4 ${
                  col === 0 ? "border-r" : ""
                }`}
              >
                <span className="font-heading text-[44px] font-extrabold text-[rgba(76,124,248,0.12)] tracking-[-0.05em] leading-none block">
                  {step.num}
                </span>
                <h3 className="font-heading text-[19px] font-bold text-[#e0e8ff] tracking-[-0.025em]">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6b7b9b] leading-[1.72]">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
