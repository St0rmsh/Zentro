import { AdminTag } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Trash, Flame, FlameKindling } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface TagTableProps {
  tags: AdminTag[];
  onToggleTrending: (tag: AdminTag) => void;
  onDelete: (id: string) => void;
}

export const TagTable = ({ tags, onToggleTrending, onDelete }: TagTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Tag Name</th>
              <th className="px-6 py-4 font-medium">Usage Count</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">#{tag.name}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {tag.usageCount.toLocaleString()} posts
                </td>
                <td className="px-6 py-4">
                  {tag.isTrending ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 flex items-center w-fit">
                      <Flame className="h-3 w-3 mr-1" /> Trending
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground w-fit">
                      Normal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggleTrending(tag)}>
                        {tag.isTrending ? <><FlameKindling className="h-4 w-4 mr-2" /> Remove Trending</> : <><Flame className="h-4 w-4 mr-2 text-rose-500" /> Make Trending</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(tag.id)} className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No tags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
