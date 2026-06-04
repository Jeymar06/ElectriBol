export default function Loading() {
  return (
    <div className="shell section-space">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-40 rounded-full bg-white/10" />
        <div className="h-14 max-w-3xl rounded-2xl bg-white/10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="surface overflow-hidden">
              <div className="aspect-[4/3] bg-white/10" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-28 rounded-full bg-white/10" />
                <div className="h-8 w-3/4 rounded-full bg-white/10" />
                <div className="h-4 w-full rounded-full bg-white/10" />
                <div className="h-4 w-5/6 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
