import { AdminPost } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, EyeOff, Eye, Star, StarOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface PostsTableProps {
  posts: AdminPost[];
  onToggleVisibility: (id: string, isHidden: boolean) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
}

export const PostsTable = ({ posts, onToggleVisibility, onToggleFeatured }: PostsTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Post Title</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Stats (V/L/C)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground line-clamp-1">{post.title}</div>
                  <div className="text-xs text-muted-foreground">{post.category} • {new Date(post.createdDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  @{post.author.username}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {post.views} / {post.likes} / {post.comments}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    {post.isHidden && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive uppercase tracking-wider">Hidden</span>
                    )}
                    {post.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-500 uppercase tracking-wider">Featured</span>
                    )}
                    {!post.isHidden && !post.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">Visible</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggleVisibility(post.id, !post.isHidden)}>
                        {post.isHidden ? <><Eye className="h-4 w-4 mr-2" /> Make Visible</> : <><EyeOff className="h-4 w-4 mr-2 text-destructive" /> Hide Post</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleFeatured(post.id, !post.isFeatured)}>
                        {post.isFeatured ? <><StarOff className="h-4 w-4 mr-2" /> Remove Featured</> : <><Star className="h-4 w-4 mr-2 text-amber-500" /> Feature Post</>}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
