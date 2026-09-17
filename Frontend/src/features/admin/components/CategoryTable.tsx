import { AdminCategory } from "../types";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Trash, Edit, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface CategoryTableProps {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (category: AdminCategory) => void;
}

export const CategoryTable = ({ categories, onEdit, onDelete, onToggleVisibility }: CategoryTableProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <div>
                      <div className="font-medium text-foreground">{category.name}</div>
                      <div className="text-xs text-muted-foreground">/{category.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground line-clamp-1">
                  {category.description}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    category.isVisible ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {category.isVisible ? 'VISIBLE' : 'HIDDEN'}
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
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleVisibility(category)}>
                        {category.isVisible ? <><EyeOff className="h-4 w-4 mr-2 text-amber-500" /> Hide</> : <><Eye className="h-4 w-4 mr-2 text-emerald-500" /> Show</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
