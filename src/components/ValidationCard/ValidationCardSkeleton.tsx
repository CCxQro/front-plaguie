const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function ValidationCardSkeleton() {
  return (
    <article
      data-testid="validation-card-skeleton"
      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* top bar placeholder */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-20 rounded bg-gray-200 ${shimmer}`} />
            <span className="h-1 w-1 rounded-full bg-gray-200" />
            <div className={`h-3 w-16 rounded bg-gray-200 ${shimmer}`} />
          </div>
          <div className={`mt-3 h-5 w-48 rounded bg-gray-200 ${shimmer}`} />
          <div className={`mt-2 h-3.5 w-32 rounded bg-gray-200 ${shimmer}`} />
        </div>
        <div className={`h-5 w-16 rounded-full bg-gray-200 ${shimmer}`} />
      </div>

      {/* description placeholder */}
      <div className="mt-4 space-y-2">
        <div className={`h-3 w-full rounded bg-gray-100 ${shimmer}`} />
        <div className={`h-3 w-3/4 rounded bg-gray-100 ${shimmer}`} />
      </div>

      {/* footer placeholder */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex gap-4">
          <div className={`h-3 w-24 rounded bg-gray-100 ${shimmer}`} />
          <div className={`h-3 w-20 rounded bg-gray-100 ${shimmer}`} />
        </div>
      </div>

      {/* button placeholder */}
      <div className="mt-6">
        <div className={`h-10 w-full rounded-xl bg-gray-100 ${shimmer}`} />
      </div>
    </article>
  );
}
