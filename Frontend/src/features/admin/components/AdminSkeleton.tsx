export const AdminSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted/50 rounded-lg w-1/4"></div>
      <div className="h-64 bg-muted/30 rounded-xl"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted/40 rounded w-full"></div>
        <div className="h-4 bg-muted/40 rounded w-full"></div>
        <div className="h-4 bg-muted/40 rounded w-3/4"></div>
      </div>
    </div>
  );
};
