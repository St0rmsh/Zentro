export const RecommendationSkeleton = () => {
  return (
    <div className="space-y-12 animate-pulse">
      {[1, 2].map(section => (
        <section key={section}>
          <div className="h-8 bg-muted/50 rounded-lg w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(card => (
              <div key={card} className="bg-card border border-border/50 rounded-2xl h-64 overflow-hidden">
                <div className="p-5 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-muted/60"></div>
                      <div className="h-4 bg-muted/50 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-muted/60 rounded w-full"></div>
                    <div className="h-6 bg-muted/60 rounded w-3/4"></div>
                    <div className="space-y-2 mt-4">
                      <div className="h-3 bg-muted/40 rounded w-full"></div>
                      <div className="h-3 bg-muted/40 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30">
                    <div className="h-4 bg-muted/50 rounded w-16"></div>
                    <div className="h-6 w-6 bg-muted/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
