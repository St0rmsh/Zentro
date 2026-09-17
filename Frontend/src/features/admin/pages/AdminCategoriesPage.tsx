import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure, deleteCategory, updateCategory } from "../state/adminCategoriesSlice";
import { categoriesService } from "../services/categories.service";
import { CategoryTable } from "../components/CategoryTable";
import { SearchBar } from "../components/SearchBar";
import { AdminLoader } from "../components/AdminLoader";
import { AdminCategory } from "../types";

export const AdminCategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector((state) => state.adminCategories);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      dispatch(fetchCategoriesStart());
      try {
        const data = await categoriesService.getCategories();
        dispatch(fetchCategoriesSuccess(data));
      } catch (err: any) {
        dispatch(fetchCategoriesFailure(err.message));
      }
    };
    loadCategories();
  }, [dispatch]);

  const handleEdit = (category: AdminCategory) => {
    // Open edit modal
    console.log("Edit category", category);
  };

  const handleDelete = async (id: string) => {
    await categoriesService.deleteCategory(id);
    dispatch(deleteCategory(id));
  };

  const handleToggleVisibility = async (category: AdminCategory) => {
    const updated = { ...category, isVisible: !category.isVisible };
    await categoriesService.updateCategory(updated);
    dispatch(updateCategory(updated));
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories Management</h1>
          <p className="text-muted-foreground mt-2">Organize content with top-level categories.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <CategoryTable 
            categories={filteredCategories} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        </div>
      )}
    </motion.div>
  );
};
