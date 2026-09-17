import type { ReactNode } from "react";
import { AuthHero } from "./AuthHero";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Hero Panel — hidden on mobile/tablet, shown on lg+ */}
      <AuthHero />

      {/* Form Panel — always visible, scrollable on mobile */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-8 sm:py-12 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
