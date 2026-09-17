import { ReactNode } from "react";

interface RecommendationSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const RecommendationSection = ({ title, subtitle, icon, children }: RecommendationSectionProps) => {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
};

interface RecommendationGridProps {
  children: ReactNode;
}

export const RecommendationGrid = ({ children }: RecommendationGridProps) => {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
};
