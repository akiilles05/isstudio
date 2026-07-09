import type { Service } from "@/types";

export default function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section
      id="szolgaltatasok"
      className="py-[clamp(80px,10vw,120px)] px-[clamp(24px,6vw,80px)] bg-navy/3 border-t border-b border-navy/8"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end flex-wrap gap-6 mb-16">
          <div>
            <p className="text-[11px] font-medium text-accent tracking-[0.1em] uppercase mb-4">Amit kapsz</p>
            <h2 className="font-heading text-[clamp(2rem,3.8vw,3.8rem)] font-extrabold tracking-[-0.04em] text-navy leading-[1.05]">
              Szolgáltatások.
            </h2>
          </div>
          <p className="text-sm text-muted max-w-[360px] leading-[1.7]">
            Weboldaltól az automatizációig - minden, amire egy modern vállalkozásnak szüksége van.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-navy/10 rounded-xl overflow-hidden">
          {services.map((svc, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const totalRows = Math.ceil(services.length / 2);
            return (
              <ServiceCard
                key={svc.id}
                svc={svc}
                borderRight={col === 0}
                borderBottom={row < totalRows - 1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  svc,
  borderRight,
  borderBottom,
}: {
  svc: Service;
  borderRight: boolean;
  borderBottom: boolean;
}) {
  return (
    <div
      className={`px-8 py-9 transition-colors duration-200 ease-in-out hover:bg-accent/4 ${
        borderRight ? "border-r border-navy/10" : ""
      } ${borderBottom ? "border-b border-navy/10" : ""}`}
    >
      <span className="font-heading text-[11px] font-bold text-accent tracking-[0.06em] block mb-5">
        {svc.num}
      </span>
      <h3 className="font-heading text-[19px] font-bold text-navy tracking-[-0.025em] mb-3 leading-[1.3]">
        {svc.title}
      </h3>
      <p className="text-sm text-muted leading-[1.72] mb-5">{svc.desc}</p>
      <p className="text-[11.5px] text-muted tracking-[0.02em]">{svc.stack}</p>
    </div>
  );
}
