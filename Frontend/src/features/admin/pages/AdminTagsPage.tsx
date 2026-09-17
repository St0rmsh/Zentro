import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchTagsStart, fetchTagsSuccess, fetchTagsFailure, deleteTag, updateTag } from "../state/adminTagsSlice";
import { tagsService } from "../services/tags.service";
import { TagTable } from "../components/TagTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AdminLoader } from "../components/AdminLoader";
import { AdminTag } from "../types";

export const AdminTagsPage = () => {
  const dispatch = useAppDispatch();
  const { tags, isLoading, total } = useAppSelector((state) => state.adminTags);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const loadTags = async () => {
      dispatch(fetchTagsStart());
      try {
        const data = await tagsService.getTags(page, limit);
        dispatch(fetchTagsSuccess(data));
      } catch (err: any) {
        dispatch(fetchTagsFailure(err.message));
      }
    };
    loadTags();
  }, [dispatch, page]);

  const handleDelete = async (id: string) => {
    await tagsService.deleteTag(id);
    dispatch(deleteTag(id));
  };

  const handleToggleTrending = async (tag: AdminTag) => {
    const updated = { ...tag, isTrending: !tag.isTrending };
    await tagsService.updateTag(updated);
    dispatch(updateTag(updated));
  };

  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">Tags Management</h1>
          <p className="text-muted-foreground mt-2">Manage and curate trending tags.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tags..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <TagTable 
            tags={filteredTags} 
            onDelete={handleDelete}
            onToggleTrending={handleToggleTrending}
          />
          <Pagination 
            currentPage={page} 
            totalPages={Math.ceil(total / limit)} 
            onPageChange={setPage} 
          />
        </div>
      )}
    </motion.div>
  );
};
