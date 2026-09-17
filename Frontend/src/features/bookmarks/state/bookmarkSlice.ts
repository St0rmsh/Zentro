import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  bookmarkService,
  Bookmark,
} from "../services/bookmark.service";

import {
  loginThunk,
  hydrateAuthThunk,
} from "../../auth/state/authThunks";

interface ToggleBookmarkPayload {
  postId: string;
  message: string;
  success: boolean;

  bookmark?: {
    message: string;
    bookmarked: boolean;
  };
}

interface BookmarkState {
  // Global bookmark state
  // Contains post IDs bookmarked by the current user.
  bookmarkedPosts: string[];

  // Loading state per post
  loading: Record<string, boolean>;

  // Bookmarks page state
  bookmarksList: Bookmark[];
  totalBookmarks: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFetchingBookmarks: boolean;
  fetchError: string | null;
}

const initialState: BookmarkState = {
  bookmarkedPosts: [],
  loading: {},

  bookmarksList: [],
  totalBookmarks: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,

  isFetchingBookmarks: false,
  fetchError: null,
};

/**
 * Toggle bookmark on the backend.
 */
export const toggleBookmarkThunk = createAsyncThunk<
  ToggleBookmarkPayload,
  string,
  { rejectValue: string }
>(
  "bookmarks/toggleBookmark",
  async (postId, { rejectWithValue }) => {
    try {
      const data = await bookmarkService.toggleBookmark(postId);

      return {
        postId,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to toggle bookmark"
      );
    }
  }
);

/**
 * Fetch user's bookmarks.
 */
export const fetchMyBookmarksThunk = createAsyncThunk<
  {
    data: any;
    append: boolean;
  },
  {
    page?: number;
    limit?: number;
    append?: boolean;
  },
  {
    rejectValue: string;
  }
>(
  "bookmarks/fetchMyBookmarks",
  async (
    {
      page = 1,
      limit = 10,
      append = false,
    },
    { rejectWithValue }
  ) => {
    try {
      const data =
        await bookmarkService.getMyBookmarks(
          page,
          limit
        );

      return {
        data,
        append,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch bookmarks"
      );
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmarks",

  initialState,

  reducers: {
    /**
     * Replace the complete global bookmark list.
     *
     * Mainly useful when authenticating/hydrating
     * the current user.
     */
    setBookmarkedPosts: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.bookmarkedPosts = action.payload;
    },

    /**
     * Set the bookmark state of ONE post.
     *
     * This is the important shared-state reducer.
     *
     * Any page can dispatch this using only the postId,
     * and every BookmarkButton in the application will
     * see the same state.
     */
    setBookmarkState: (
      state,
      action: PayloadAction<{
        postId: string;
        bookmarked: boolean;
      }>
    ) => {
      const {
        postId,
        bookmarked,
      } = action.payload;

      if (bookmarked) {
        if (
          !state.bookmarkedPosts.includes(postId)
        ) {
          state.bookmarkedPosts.push(postId);
        }
      } else {
        state.bookmarkedPosts =
          state.bookmarkedPosts.filter(
            (id) => id !== postId
          );
      }
    },

    /**
     * Optimistically add a bookmark.
     */
    addBookmark: (
      state,
      action: PayloadAction<string>
    ) => {
      const postId = action.payload;

      if (!state.bookmarkedPosts.includes(postId)) {
        state.bookmarkedPosts.push(postId);
      }
    },

    /**
     * Optimistically remove a bookmark.
     */
    removeBookmark: (
      state,
      action: PayloadAction<string>
    ) => {
      const postId = action.payload;

      state.bookmarkedPosts =
        state.bookmarkedPosts.filter(
          (id) => id !== postId
        );
    },

    /**
     * Update comments count inside the bookmark list.
     */
    updateBookmarkCommentsCount: (
      state,
      action: PayloadAction<{
        postId: string;
        delta: number;
      }>
    ) => {
      const {
        postId,
        delta,
      } = action.payload;

      state.bookmarksList =
        state.bookmarksList.map(
          (bookmark) => {
            if (
              !bookmark.post ||
              typeof bookmark.post !== "object"
            ) {
              return bookmark;
            }

            if (
              bookmark.post._id !== postId
            ) {
              return bookmark;
            }

            return {
              ...bookmark,

              post: {
                ...bookmark.post,

                commentsCount: Math.max(
                  0,
                  (bookmark.post.commentsCount ??
                    0) + delta
                ),
              },
            };
          }
        );
    },

    /**
     * Set exact comments count inside bookmark list.
     */
    setBookmarkCommentsCount: (
      state,
      action: PayloadAction<{
        postId: string;
        count: number;
      }>
    ) => {
      const {
        postId,
        count,
      } = action.payload;

      state.bookmarksList =
        state.bookmarksList.map(
          (bookmark) => {
            if (
              !bookmark.post ||
              typeof bookmark.post !== "object"
            ) {
              return bookmark;
            }

            if (
              bookmark.post._id !== postId
            ) {
              return bookmark;
            }

            return {
              ...bookmark,

              post: {
                ...bookmark.post,

                commentsCount: Math.max(
                  0,
                  count
                ),
              },
            };
          }
        );
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // TOGGLE BOOKMARK
      // =====================================================

      .addCase(
        toggleBookmarkThunk.pending,
        (state, action) => {
          const postId = action.meta.arg;

          state.loading[postId] = true;
        }
      )

      .addCase(
        toggleBookmarkThunk.fulfilled,
        (state, action) => {
          const {
            postId,
            bookmark,
          } = action.payload;

          state.loading[postId] = false;

          const isBookmarked =
            bookmark?.bookmarked ?? false;

          if (isBookmarked) {
            if (
              !state.bookmarkedPosts.includes(
                postId
              )
            ) {
              state.bookmarkedPosts.push(
                postId
              );
            }
          } else {
            state.bookmarkedPosts =
              state.bookmarkedPosts.filter(
                (id) => id !== postId
              );

            /*
             * Also remove it from the currently
             * loaded bookmarks page.
             */
            state.bookmarksList =
              state.bookmarksList.filter(
                (bookmarkItem) => {
                  const bookmarkPostId =
                    bookmarkItem.post &&
                    typeof bookmarkItem.post ===
                      "object"
                      ? bookmarkItem.post._id
                      : bookmarkItem.post;

                  return (
                    bookmarkPostId !== postId
                  );
                }
              );
          }
        }
      )

      .addCase(
        toggleBookmarkThunk.rejected,
        (state, action) => {
          const postId = action.meta.arg;

          state.loading[postId] = false;
        }
      )

      // =====================================================
      // FETCH MY BOOKMARKS
      // =====================================================

      .addCase(
        fetchMyBookmarksThunk.pending,
        (state) => {
          state.isFetchingBookmarks = true;
          state.fetchError = null;
        }
      )

      .addCase(
        fetchMyBookmarksThunk.fulfilled,
        (state, action) => {
          state.isFetchingBookmarks = false;

          const {
            data,
            append,
          } = action.payload;

          const bookmarks: Bookmark[] =
            Array.isArray(data.bookmarks)
              ? data.bookmarks
              : [];

          const pagination =
            data.pagination ?? {
              currentPage:
                data.currentPage ?? 1,

              totalPages:
                data.totalPages ?? 1,

              totalBookmarks:
                data.totalBookmarks ?? 0,

              hasNextPage:
                data.hasNextPage ?? false,

              hasPrevPage:
                data.hasPrevPage ?? false,
            };

          // -------------------------------------------------
          // Update bookmarks page list
          // -------------------------------------------------

          if (append) {
            const existingIds =
              new Set(
                state.bookmarksList.map(
                  (bookmark) =>
                    bookmark._id
                )
              );

            const newBookmarks =
              bookmarks.filter(
                (bookmark) =>
                  !existingIds.has(
                    bookmark._id
                  )
              );

            state.bookmarksList = [
              ...state.bookmarksList,
              ...newBookmarks,
            ];
          } else {
            state.bookmarksList =
              bookmarks;
          }

          // -------------------------------------------------
          // Update GLOBAL bookmark state
          // -------------------------------------------------
          //
          // IMPORTANT:
          //
          // We do NOT simply replace bookmarkedPosts
          // when append=true.
          //
          // This prevents page 2 from destroying the
          // bookmark IDs loaded from page 1.
          // -------------------------------------------------

          const fetchedBookmarkIds =
            bookmarks
              .map(
                (bookmark: Bookmark) =>
                  bookmark.post?._id ??
                  bookmark.post
              )
              .filter(
                (
                  id
                ): id is string =>
                  Boolean(id)
              );

          if (append) {
            const mergedIds = new Set(
              state.bookmarkedPosts
            );

            for (const postId of fetchedBookmarkIds) {
              mergedIds.add(postId);
            }

            state.bookmarkedPosts =
              Array.from(mergedIds);
          } else {
            /*
             * For a fresh page=1 request, the backend
             * response represents the currently loaded
             * bookmark collection.
             *
             * However, if pagination exists, we should
             * preserve previously known IDs from other
             * pages instead of assuming this page contains
             * every bookmark.
             */
            if (
              pagination.totalPages <= 1
            ) {
              state.bookmarkedPosts =
                fetchedBookmarkIds;
            } else {
              const mergedIds = new Set(
                state.bookmarkedPosts
              );

              for (const postId of fetchedBookmarkIds) {
                mergedIds.add(postId);
              }

              state.bookmarkedPosts =
                Array.from(mergedIds);
            }
          }

          // -------------------------------------------------
          // Pagination
          // -------------------------------------------------

          state.currentPage =
            pagination.currentPage;

          state.totalPages =
            pagination.totalPages;

          state.totalBookmarks =
            pagination.totalBookmarks;

          state.hasNextPage =
            pagination.hasNextPage;

          state.hasPrevPage =
            pagination.hasPrevPage;
        }
      )

      .addCase(
        fetchMyBookmarksThunk.rejected,
        (state, action) => {
          state.isFetchingBookmarks = false;

          state.fetchError =
            action.payload ||
            "Error fetching bookmarks";
        }
      )

      // =====================================================
      // LOGIN
      // =====================================================

      .addCase(
        loginThunk.fulfilled,
        (state, action) => {
          const bookmarkedPosts =
            action.payload.user
              ?.bookmarkedPosts;

          if (
            Array.isArray(
              bookmarkedPosts
            )
          ) {
            state.bookmarkedPosts =
              bookmarkedPosts;
          }
        }
      )

      // =====================================================
      // AUTH HYDRATION
      // =====================================================

      .addCase(
        hydrateAuthThunk.fulfilled,
        (state, action) => {
          const bookmarkedPosts =
            action.payload
              ?.bookmarkedPosts;

          if (
            Array.isArray(
              bookmarkedPosts
            )
          ) {
            state.bookmarkedPosts =
              bookmarkedPosts;
          }
        }
      );
  },
});

export const {
  setBookmarkedPosts,
  setBookmarkState,
  addBookmark,
  removeBookmark,
  updateBookmarkCommentsCount,
  setBookmarkCommentsCount,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;