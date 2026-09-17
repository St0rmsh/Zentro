import { calculatePasswordStrength, getPasswordStrengthLabel } from "@/shared/utils/passwordStrength";
import { motion } from "framer-motion";

interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  if (!password) return null;

  const score = calculatePasswordStrength(password);
  const { label, color } = getPasswordStrengthLabel(score);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-full ${
              index <= score ? color : "bg-muted"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          />
        ))}
      </div>
      <p className={`text-xs text-right font-medium ${
        score <= 2 ? "text-destructive" : score === 3 ? "text-yellow-500" : "text-success"
      }`}>
        {label}
      </p>
    </div>
  );
};
