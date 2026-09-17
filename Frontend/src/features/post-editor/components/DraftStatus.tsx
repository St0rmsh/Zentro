import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Cloud,
  CloudOff,
  CheckCircle2,
} from "lucide-react";

export const DraftStatus: React.FC = () => {
  const {
    isSaving,
    isDirty,
    lastSavedAt,
    isPublished,
  } = useSelector(
    (state: RootState) => state.postEditor
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Cloud className="h-4 w-4 animate-pulse" />
          Saving...
        </span>
      ) : isDirty ? (
        <span className="flex items-center gap-1 text-amber-500">
          <CloudOff className="h-4 w-4" />
          Unsaved changes
        </span>
      ) : lastSavedAt ? (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {isPublished ? "Published" : "Saved"}{" "}
          {new Date(lastSavedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ) : (
        <span className="text-muted-foreground">
          New Draft
        </span>
      )}
    </div>
  );
};