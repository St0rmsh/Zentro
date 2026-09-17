import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, togglePostVisibility, togglePostFeatured } from "../state/adminPostsSlice";
import { postsService } from "../services/posts.service";
import { PostsTable } from "../components/PostsTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { AdminLoader } from "../components/AdminLoader";

export const AdminPostsPage = () => {
  const dispatch = useAppDispatch();
  const { posts, isLoading, total } = useAppSelector((state) => state.adminPosts);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const loadPosts = async () => {
      dispatch(fetchPostsStart());
      try {
        const data = await postsService.getPosts(page, limit);
        dispatch(fetchPostsSuccess(data));
      } catch (err: any) {
        dispatch(fetchPostsFailure(err.message));
      }
    };
    loadPosts();
  }, [dispatch, page]);

  const handleToggleVisibility = async (id: string, isHidden: boolean) => {
    await postsService.toggleVisibility(id, isHidden);
    dispatch(togglePostVisibility({ id, isHidden }));
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    await postsService.toggleFeatured(id, isFeatured);
    dispatch(togglePostFeatured({ id, isFeatured }));
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.username.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">Posts Management</h1>
          <p className="text-muted-foreground mt-2">Manage published posts, visibility, and featured content.</p>
        </div>
        <div className="w-full sm:w-auto">
          <SearchBar value={search} onChange={setSearch} placeholder="Search posts..." className="w-full sm:w-64" />
        </div>
      </div>

      {isLoading ? (
        <AdminLoader />
      ) : (
        <div className="space-y-4">
          <PostsTable 
            posts={filteredPosts} 
            onToggleVisibility={handleToggleVisibility} 
            onToggleFeatured={handleToggleFeatured} 
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
