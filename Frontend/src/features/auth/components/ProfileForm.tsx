import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  User,
  ImageIcon,
  Mail,
  FileText,
  Check,
} from "lucide-react";

import { profileSchema, ProfileFormData } from "../schemas/profile.schema";
import { useAuth } from "../hooks/useAuth";
import { AUTH_MESSAGES } from "../constants/authMessages";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { AvatarUploader } from "./AvatarUploader";
import { BannerUploader } from "./BannerUploader";

const BIO_MAX_LENGTH = 160;

export const ProfileForm = () => {
  const { user, updateProfile, loading } = useAuth();

  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [bannerFile, setBannerFile] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      fullname: user?.fullname || "",
      bio: user?.bio || "",
    },
  });

  const bioValue = watch("bio") || "";

  const hasUnsavedChanges =
    isDirty || Boolean(avatarFile) || Boolean(bannerFile);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data, avatarFile, bannerFile);

      setAvatarFile(undefined);
      setBannerFile(undefined);

      toast.success(AUTH_MESSAGES.UPDATE_PROFILE_SUCCESS);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* ---------------------------------- */}
      {/* Profile Photos                     */}
      {/* ---------------------------------- */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Profile Photos
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Update your profile picture and cover image.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          {/* Banner */}
          <div className="bg-muted/30 p-3 sm:p-4">
            <BannerUploader
              currentBannerUrl={user?.banner}
              onFileSelect={setBannerFile}
            />
          </div>

          {/* Avatar */}
          <div className="border-t border-border px-4 pb-4 pt-0">
            <div className="relative -mt-10 sm:-mt-12">
              <AvatarUploader
                currentAvatarUrl={user?.avatar}
                onFileSelect={setAvatarFile}
              />
            </div>

            <div className="mt-3 pl-1">
              <p className="text-sm font-medium text-foreground">
                Profile picture
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This will appear next to your name across Zentro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* Divider                             */}
      {/* ---------------------------------- */}

      <div className="my-8 h-px bg-border" />

      {/* ---------------------------------- */}
      {/* Personal Information               */}
      {/* ---------------------------------- */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Manage the information shown on your profile.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Full name + Username */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>

              <Input
                id="fullname"
                placeholder="Your full name"
                {...register("fullname")}
              />

              {errors.fullname && (
                <p className="text-xs text-destructive">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>

                <Input
                  id="username"
                  placeholder="username"
                  className="pl-7"
                  {...register("username")}
                />
              </div>

              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted/50 pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Your email address can't be changed here.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>

              <span
                className={`text-xs ${
                  bioValue.length > BIO_MAX_LENGTH
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {bioValue.length}/{BIO_MAX_LENGTH}
              </span>
            </div>

            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <textarea
                id="bio"
                {...register("bio")}
                maxLength={BIO_MAX_LENGTH}
                placeholder="Tell us a little about yourself"
                className="flex min-h-[120px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {errors.bio && (
              <p className="text-xs text-destructive">
                {errors.bio.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------- */}
      {/* Save area                           */}
      {/* ---------------------------------- */}

      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs text-muted-foreground">
                You have unsaved changes.
              </p>
            </>
          ) : (
            <>
              <Check className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                All changes saved.
              </p>
            </>
          )}
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <Button
            variant="outline"
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading || !hasUnsavedChanges}
            className="flex-1 sm:flex-none"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};