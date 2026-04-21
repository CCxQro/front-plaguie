import type { ReactNode } from 'react';

function SolutionCard({
  icon,
  title,
  description,
  width,
  height,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  width?: string;
  height?: string;
}) {
  return (
    <section className={`flex ${width} ${height || ''} flex-col items-start gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}>
      {icon}

      <div className="flex flex-col items-start gap-3">
        <h3 className="text-xl font-bold leading-7 text-[#0F172A]">{title}</h3>

        <p className="text-base font-normal leading-6.5 text-[#475569]">{description}</p>
      </div>
    </section>
  );
}

export default SolutionCard;
