export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (!password) return score;

  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Max score is 5
  return Math.min(5, score);
};

export const getPasswordStrengthLabel = (score: number): { label: string; color: string } => {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "bg-destructive" };
    case 2:
      return { label: "Fair", color: "bg-orange-500" };
    case 3:
      return { label: "Good", color: "bg-yellow-500" };
    case 4:
      return { label: "Strong", color: "bg-success" };
    case 5:
      return { label: "Excellent", color: "bg-success" };
    default:
      return { label: "", color: "bg-muted" };
  }
};
