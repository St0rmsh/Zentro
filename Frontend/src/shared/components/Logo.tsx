import { Link } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to={ROUTES.HOME} className={`flex items-center gap-2 transition-transform active:scale-95 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl leading-none shadow-sm">
        Z
      </div>
      <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Zentro</span>
    </Link>
  );
};
