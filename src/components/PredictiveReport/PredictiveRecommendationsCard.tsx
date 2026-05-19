interface PredictiveRecommendationsCardProps {
  recommendations: string[];
}

export function PredictiveRecommendationsCard({ recommendations }: PredictiveRecommendationsCardProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div
      data-testid="recommendations-card"
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-3"
    >
      <h3 className="text-sm font-semibold text-[#101828]">
        Acciones recomendadas para el ejecutivo de ventas
      </h3>
      <ul className="space-y-2">
        {recommendations.map((rec, i) => (
          <li
            key={i}
            data-testid="recommendation-item"
            className="flex gap-3 text-sm text-[#374151]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[10px] font-bold text-[#16A34A]">
              {i + 1}
            </span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
