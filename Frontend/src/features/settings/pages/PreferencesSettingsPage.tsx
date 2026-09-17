import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  AtSign,
  Bookmark,
  UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/shared/hooks";

import {
  setLanguage,
  updatePreferences,
} from "../state/settingsSlice";

import type {
  Language,
} from "../types/index";

import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { PreferenceToggle } from "../components/PreferenceToggle";

import { authService } from "@/features/auth/services/auth.service";

/* -------------------------------------------------------------------------- */
/*                                Language Data                               */
/* -------------------------------------------------------------------------- */

interface LanguageOption {
  value: Language;
  name: string;
  nativeName: string;
  code: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    value: "en",
    name: "English",
    nativeName: "English",
    code: "EN",
  },
  {
    value: "es",
    name: "Spanish",
    nativeName: "Español",
    code: "ES",
  },
  {
    value: "fr",
    name: "French",
    nativeName: "Français",
    code: "FR",
  },
  {
    value: "de",
    name: "German",
    nativeName: "Deutsch",
    code: "DE",
  },
];

/* -------------------------------------------------------------------------- */
/*                              Language Selector                             */
/* -------------------------------------------------------------------------- */

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}

const LanguageSelector = ({
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === value) ??
    LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | globalThis.MouseEvent) => {
      const target = event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown as EventListener
    );

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown as EventListener
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  const handleSelect = (language: Language) => {
    onChange(language);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "group flex w-full items-center gap-3",
          "rounded-xl border",
          "bg-background",
          "px-3.5 py-3",
          "text-left",
          "transition-all duration-150",
          "focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
          open
            ? "border-primary ring-2 ring-primary/15"
            : "border-border hover:border-primary/50",
        ].join(" ")}
      >
        {/* Globe */}
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center",
            "rounded-lg border border-border",
            "bg-muted",
            "text-muted-foreground",
            "transition-colors",
            open
              ? "text-primary"
              : "group-hover:text-foreground",
          ].join(" ")}
        >
          <Globe2 className="h-5 w-5" />
        </span>

        {/* Language name */}
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-medium text-muted-foreground">
            Language
          </span>

          <span className="mt-0.5 block truncate text-sm font-semibold text-foreground">
            {selectedLanguage.nativeName}
          </span>
        </span>

        {/* Code */}
        <span
          className={[
            "hidden shrink-0 rounded-md border px-2 py-1",
            "text-[11px] font-bold tracking-wide",
            "sm:inline-flex",
            "border-border bg-muted",
            "text-muted-foreground",
          ].join(" ")}
        >
          {selectedLanguage.code}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={[
            "h-4 w-4 shrink-0 text-muted-foreground",
            "transition-transform duration-200",
            open ? "rotate-180 text-foreground" : "",
          ].join(" ")}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
            className={[
              "absolute left-0 right-0 top-full z-[100]",
              "mt-2",
              "overflow-hidden",
              "rounded-xl",
              "border border-border",
              "bg-card",
              "shadow-2xl",
              "ring-1 ring-black/5 dark:ring-white/10",
            ].join(" ")}
          >
            {/* Dropdown header */}
            <div className="border-b border-border bg-muted/30 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Select language
                </span>

                <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            {/* Options */}
            <div
              role="listbox"
              aria-label="Select language"
              className="p-1.5"
            >
              {LANGUAGE_OPTIONS.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={[
                      "flex w-full items-center gap-3",
                      "rounded-lg px-2.5 py-2.5",
                      "text-left",
                      "transition-colors duration-150",
                      isSelected
                        ? "bg-primary/10"
                        : "hover:bg-muted",
                    ].join(" ")}
                  >
                    {/* Language icon */}
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center",
                        "rounded-lg border",
                        isSelected
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground",
                      ].join(" ")}
                    >
                      <Globe2 className="h-4 w-4" />
                    </span>

                    {/* Text */}
                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "block truncate text-sm font-medium",
                          isSelected
                            ? "text-foreground"
                            : "text-foreground",
                        ].join(" ")}
                      >
                        {option.nativeName}
                      </span>

                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.name}
                      </span>
                    </span>

                    {/* Code */}
                    <span
                      className={[
                        "shrink-0 rounded-md border px-2 py-1",
                        "text-[10px] font-bold tracking-wide",
                        isSelected
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {option.code}
                    </span>

                    {/* Selected */}
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Preference Row Helper                            */
/* -------------------------------------------------------------------------- */

interface PreferenceRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PreferenceRow = ({
  icon,
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: PreferenceRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {title}
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <PreferenceToggle
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Page                                     */
/* -------------------------------------------------------------------------- */

const PreferencesSettingsPage = () => {
  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();

  const language = useAppSelector(
    (state) => state.settings.language
  );

  const preferences = useAppSelector(
    (state) => state.settings.preferences
  );

  const [loading, setLoading] = useState(true);

  const [savingLanguage, setSavingLanguage] = useState(false);

  const [savingPreference, setSavingPreference] =
    useState<string | null>(null);

  const [notificationPreferences, setNotificationPreferences] =
    useState({
      likes: preferences?.notifications?.likes ?? true,
      comments: preferences?.notifications?.comments ?? true,
      follows: preferences?.notifications?.follows ?? true,
      mentions: preferences?.notifications?.mentions ?? true,
      bookmarks: preferences?.notifications?.bookmarks ?? true,
    });

  /* ------------------------------------------------------------------------ */
  /*                              Load Settings                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);

        const response = await authService.getSettings();

        if (!mounted) {
          return;
        }

        const settings = response?.data ?? response;

        if (settings?.language) {
          dispatch(
            setLanguage(settings.language as Language)
          );

          await i18n.changeLanguage(settings.language);
        }

        if (settings?.preferences) {
          dispatch(
            updatePreferences(settings.preferences)
          );

          if (settings.preferences.notifications) {
            setNotificationPreferences({
              likes:
                settings.preferences.notifications.likes ??
                true,

              comments:
                settings.preferences.notifications.comments ??
                true,

              follows:
                settings.preferences.notifications.follows ??
                true,

              mentions:
                settings.preferences.notifications.mentions ??
                true,

              bookmarks:
                settings.preferences.notifications.bookmarks ??
                true,
            });
          }
        }
      } catch (error) {
        console.error(
          "Failed to load preferences:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, [dispatch, i18n]);

  /* ------------------------------------------------------------------------ */
  /*                         Language Change                                  */
  /* ------------------------------------------------------------------------ */

  const handleLanguageChange = async (
    nextLanguage: Language
  ) => {
    if (
      nextLanguage === language ||
      savingLanguage
    ) {
      return;
    }

    const previousLanguage = language;

    try {
      setSavingLanguage(true);

      dispatch(setLanguage(nextLanguage));

      await i18n.changeLanguage(nextLanguage);

      await authService.updateSettings({
        language: nextLanguage,
      });
    } catch (error) {
      console.error(
        "Failed to update language:",
        error
      );

      dispatch(setLanguage(previousLanguage));

      await i18n.changeLanguage(previousLanguage);
    } finally {
      setSavingLanguage(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                      Notification Preference                             */
  /* ------------------------------------------------------------------------ */

  const handleNotificationChange = async (
    key: keyof typeof notificationPreferences,
    checked: boolean
  ) => {
    if (savingPreference) {
      return;
    }

    const previousValue =
      notificationPreferences[key];

    setNotificationPreferences((current) => ({
      ...current,
      [key]: checked,
    }));

    setSavingPreference(key);

    try {
      const nextNotifications = {
        ...notificationPreferences,
        [key]: checked,
      };

      dispatch(
        updatePreferences({
          notifications: nextNotifications,
        }),
      );

      await authService.updateSettings({
        preferences: {
          notifications: nextNotifications,
        },
      });
    } catch (error) {
      console.error(
        "Failed to update notification preference:",
        error
      );

      setNotificationPreferences((current) => ({
        ...current,
        [key]: previousValue,
      }));

      dispatch(
        updatePreferences({
          notifications: {
            ...notificationPreferences,
            [key]: previousValue,
          },
        }),
      );
    } finally {
      setSavingPreference(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  UI                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <SettingsHeader
          title={t("settings.preferences.title", "Preferences")}
          description={t(
            "settings.preferences.description",
            "Customize your language and notification preferences."
          )}
        />

        <div className="mt-6 space-y-5">
          {/* ---------------------------------------------------------------- */}
          {/* Language                                                         */}
          {/* ---------------------------------------------------------------- */}

          <SettingsCard
            title={t(
              "settings.preferences.language.title",
              "Language"
            )}
            description={t(
              "settings.preferences.language.description",
              "Choose the language used throughout SignalHunt."
            )}
            overflow="visible"
          >
            <div className="max-w-xl">
              {loading ? (
                <div className="h-[66px] animate-pulse rounded-xl border border-border bg-muted/40" />
              ) : (
                <LanguageSelector
                  value={language}
                  onChange={handleLanguageChange}
                  disabled={savingLanguage}
                />
              )}

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {savingLanguage
                  ? "Saving your language preference..."
                  : "Your language preference is saved to your account and used across the application."}
              </p>
            </div>
          </SettingsCard>

          {/* ---------------------------------------------------------------- */}
          {/* Notifications                                                    */}
          {/* ---------------------------------------------------------------- */}

          <SettingsCard
            title={t(
              "settings.preferences.notifications.title",
              "Notifications"
            )}
            description={t(
              "settings.preferences.notifications.description",
              "Choose which activity notifications you want to receive."
            )}
          >
            <div className="divide-y divide-border">
              <PreferenceRow
                icon={<Heart className="h-4 w-4" />}
                title={t(
                  "settings.preferences.notifications.likes",
                  "Likes"
                )}
                description={t(
                  "settings.preferences.notifications.likesDescription",
                  "Get notified when someone likes your post."
                )}
                checked={notificationPreferences.likes}
                onChange={(checked) =>
                  void handleNotificationChange(
                    "likes",
                    checked
                  )
                }
                disabled={
                  savingPreference !== null
                }
              />

              <PreferenceRow
                icon={
                  <MessageCircle className="h-4 w-4" />
                }
                title={t(
                  "settings.preferences.notifications.comments",
                  "Comments"
                )}
                description={t(
                  "settings.preferences.notifications.commentsDescription",
                  "Get notified when someone comments on your post."
                )}
                checked={
                  notificationPreferences.comments
                }
                onChange={(checked) =>
                  void handleNotificationChange(
                    "comments",
                    checked
                  )
                }
                disabled={
                  savingPreference !== null
                }
              />

              <PreferenceRow
                icon={<UserPlus className="h-4 w-4" />}
                title={t(
                  "settings.preferences.notifications.follows",
                  "New followers"
                )}
                description={t(
                  "settings.preferences.notifications.followsDescription",
                  "Get notified when someone follows you."
                )}
                checked={
                  notificationPreferences.follows
                }
                onChange={(checked) =>
                  void handleNotificationChange(
                    "follows",
                    checked
                  )
                }
                disabled={
                  savingPreference !== null
                }
              />

              <PreferenceRow
                icon={<AtSign className="h-4 w-4" />}
                title={t(
                  "settings.preferences.notifications.mentions",
                  "Mentions"
                )}
                description={t(
                  "settings.preferences.notifications.mentionsDescription",
                  "Get notified when someone mentions you."
                )}
                checked={
                  notificationPreferences.mentions
                }
                onChange={(checked) =>
                  void handleNotificationChange(
                    "mentions",
                    checked
                  )
                }
                disabled={
                  savingPreference !== null
                }
              />

              <PreferenceRow
                icon={<Bookmark className="h-4 w-4" />}
                title={t(
                  "settings.preferences.notifications.bookmarks",
                  "Bookmarks"
                )}
                description={t(
                  "settings.preferences.notifications.bookmarksDescription",
                  "Get notified about bookmark activity."
                )}
                checked={
                  notificationPreferences.bookmarks
                }
                onChange={(checked) =>
                  void handleNotificationChange(
                    "bookmarks",
                    checked
                  )
                }
                disabled={
                  savingPreference !== null
                }
              />
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettingsPage;