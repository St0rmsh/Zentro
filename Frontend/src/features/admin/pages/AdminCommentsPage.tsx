import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchCommentsStart, fetchCommentsSuccess, fetchCommentsFailure, updateCommentStatus } from "../state/adminCommentsSlice";
import { commentsService } from "../services/comments.service";
import { CommentsTable } from "../components/CommentsTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AdminLoader } from "../components/AdminLoader";
import { AdminComment } from "../types";

export const AdminCommentsPage = () => {
  const dispatch = useAppDispatch();
  const { comments, isLoading, total } = useAppSelector((state) => state.adminComments);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const loadComments = async () => {
      dispatch(fetchCommentsStart());
      try {
        const data = await commentsService.getComments(page, limit);
        dispatch(fetchCommentsSuccess(data));
      } catch (err: any) {
        dispatch(fetchCommentsFailure(err.message));
      }
    };
    loadComments();
  }, [dispatch, page]);

  const handleUpdateStatus = async (id: string, status: AdminComment['status']) => {
    await commentsService.updateStatus(id, status);
    dispatch(updateCommentStatus({ id, status }));
  };

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.author.username.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">Comments Moderation</h1>
          <p className="text-muted-foreground mt-2">Review, hide, or approve user comments.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search comments..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <CommentsTable 
            comments={filteredComments} 
            onUpdateStatus={handleUpdateStatus} 
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
