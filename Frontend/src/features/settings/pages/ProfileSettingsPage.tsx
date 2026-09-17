import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserRound,
  Info,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { ProfileForm } from "@/features/auth/components/ProfileForm";

export const ProfileSettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto w-full max-w-5xl space-y-6 pb-10"
    >
      {/* Page header */}
      <div className="rounded-xl border border-border bg-background">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
                <UserRound className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <SettingsHeader
                  title="Profile Settings"
                  description="Manage your public profile and personal information."
                />
              </div>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1.5 sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Account
              </span>
            </div>
          </div>

          {/* Settings overview */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Profile
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    Personal information
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Security
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    Protected account
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
                  <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Privacy
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    Control your visibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <SettingsCard>
        <div>
          <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Personal Information
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Keep your profile information up to date. This information
                may be displayed across Zentro.
              </p>
            </div>
          </div>

          <ProfileForm />
        </div>
      </SettingsCard>

      {/* Information notice */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background">
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">
            Profile visibility
          </p>

          <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
            Your profile information may be visible to other users across
            Zentro. Only add information that you are comfortable sharing.
          </p>
        </div>
      </div>
    </motion.div>
  );
};