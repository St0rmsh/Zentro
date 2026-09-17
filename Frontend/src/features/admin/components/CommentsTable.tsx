import { AdminComment } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Trash, EyeOff, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface CommentsTableProps {
  comments: AdminComment[];
  onUpdateStatus: (id: string, status: AdminComment['status']) => void;
}

export const CommentsTable = ({ comments, onUpdateStatus }: CommentsTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Comment</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-medium text-foreground line-clamp-2">{comment.content}</div>
                  <div className="text-xs text-muted-foreground mt-1">on: {comment.post.title}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  @{comment.author.username}
                  <div className="text-xs opacity-70">{new Date(comment.createdDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    comment.status === 'VISIBLE' ? 'bg-emerald-500/10 text-emerald-500' :
                    comment.status === 'HIDDEN' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {comment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {comment.status !== 'VISIBLE' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'VISIBLE')}>
                          <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> Approve
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'HIDDEN' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'HIDDEN')}>
                          <EyeOff className="h-4 w-4 mr-2 text-amber-500" /> Hide
                        </DropdownMenuItem>
                      )}
                      {comment.status !== 'DELETED' && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(comment.id, 'DELETED')} className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No comments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
