import { motion } from "framer-motion";
import { Mail, AtSign, ShieldCheck, AlertTriangle, UserX, Trash2 } from "lucide-react";
import { useAppSelector } from "@/shared/hooks";
import { useAppDispatch } from "@/shared/hooks";
import { useNavigate } from "react-router-dom";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { Button } from "@/shared/ui/button";
import { authService } from "@/features/auth/services/auth.service";
import { logoutThunk } from "@/features/auth/state/authThunks";

export const AccountSettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const deactivate = async () => {
    if (!window.confirm("Deactivate your account?")) return;
    await authService.deactivateAccount();
    await dispatch(logoutThunk());
    navigate("/auth/login", { replace: true });
  };

  const removeAccount = async () => {
    if (!window.confirm("Delete your account permanently?")) return;
    await authService.deleteAccount();
    await dispatch(logoutThunk());
    navigate("/auth/login", { replace: true });
  };

  const infoRows = [
    { icon: Mail, label: "Email Address", value: user.email },
    { icon: AtSign, label: "Username", value: `@${user.username}` },
    { icon: ShieldCheck, label: "Role", value: user.role?.toLowerCase() || "user", capitalize: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader
        title="Account Settings"
        description="View and manage your account details."
      />

      <SettingsCard title="Account Details" description="Information related to your account standing.">
        <div className="divide-y divide-border/50">
          {infoRows.map(({ icon: Icon, label, value, capitalize }) => (
            <div key={label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className={`text-sm font-medium text-foreground truncate ${capitalize ? "capitalize" : ""}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Danger Zone"
        description="These actions affect your account access and cannot be easily undone."
        className="border-destructive/30"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <UserX className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-destructive">Deactivate Account</h4>
                <p className="text-sm text-muted-foreground">Temporarily hide your profile, posts, and comments. You can reactivate by logging back in.</p>
              </div>
            </div>
            <Button onClick={deactivate} variant="outline" className="shrink-0 text-destructive border-destructive/50 hover:bg-destructive/10">
              Deactivate
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <Trash2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data. This cannot be reversed.</p>
              </div>
            </div>
            <Button onClick={removeAccount} variant="destructive" className="shrink-0">
              Delete Account
            </Button>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Deleting your account removes your posts, comments, and follower relationships permanently. Consider deactivating first if you're unsure.</span>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  );
};