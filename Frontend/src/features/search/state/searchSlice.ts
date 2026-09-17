import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchService } from "../services/search.service";
import type { Post } from "@/features/feed/types/feed.types";
import type { User } from "@/shared/types/user.types";
import type { Tag, PaginationData } from "../types";

export const MAX_RECENT_SEARCHES = 10;

interface SearchState {
  query: string;
  recentSearches: string[];
  
  // Search Overview
  overviewLoading: boolean;
  overviewPosts: Post[];
  overviewUsers: User[];
  overviewTags: Tag[];

  // Detailed Search
  posts: Post[];
  users: User[];
  tags: Tag[];
  
  postsPagination: PaginationData | null;
  usersPagination: PaginationData | null;

  loading: boolean;
  error: string | null;

  // Discover
  discoverLoading: boolean;
  trendingPosts: Post[];
  topUsers: User[];
  trendingTags: Tag[];
}

const loadRecentSearches = (): string[] => {
  try {
    const saved = localStorage.getItem("zentro_recent_searches");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: SearchState = {
  query: "",
  recentSearches: loadRecentSearches(),

  overviewLoading: false,
  overviewPosts: [],
  overviewUsers: [],
  overviewTags: [],

  posts: [],
  users: [],
  tags: [],

  postsPagination: null,
  usersPagination: null,

  loading: false,
  error: null,

  discoverLoading: false,
  trendingPosts: [],
  topUsers: [],
  trendingTags: [],
};

export const fetchSearchOverview = createAsyncThunk(
  "search/fetchOverview",
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchService.getSearchOverview(query);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch search overview");
    }
  }
);

export const fetchSearchPosts = createAsyncThunk(
  "search/fetchPosts",
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      return await searchService.searchPosts(query, page);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch search posts");
    }
  }
);

export const fetchSearchUsers = createAsyncThunk(
  "search/fetchUsers",
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      return await searchService.searchUsers(query, page);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch search users");
    }
  }
);

export const fetchSearchTags = createAsyncThunk(
  "search/fetchTags",
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchService.searchTags(query);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch search tags");
    }
  }
);

export const fetchDiscoverData = createAsyncThunk(
  "search/fetchDiscoverData",
  async (_, { rejectWithValue }) => {
    try {
      return await searchService.getDiscoverData();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch discover data");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      
      const existingIndex = state.recentSearches.indexOf(query);
      if (existingIndex !== -1) {
        state.recentSearches.splice(existingIndex, 1);
      }
      
      state.recentSearches.unshift(query);
      if (state.recentSearches.length > MAX_RECENT_SEARCHES) {
        state.recentSearches.pop();
      }
      
      localStorage.setItem("zentro_recent_searches", JSON.stringify(state.recentSearches));
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(q => q !== action.payload);
      localStorage.setItem("zentro_recent_searches", JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem("zentro_recent_searches");
    },
    clearSearchResults: (state) => {
      state.posts = [];
      state.users = [];
      state.tags = [];
      state.postsPagination = null;
      state.usersPagination = null;
    }
  },
  extraReducers: (builder) => {
    // Overview
    builder.addCase(fetchSearchOverview.pending, (state) => {
      state.overviewLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSearchOverview.fulfilled, (state, action) => {
      state.overviewLoading = false;
      state.overviewPosts = action.payload.posts || [];
      state.overviewUsers = action.payload.users || [];
      state.overviewTags = action.payload.tags || [];
    });
    builder.addCase(fetchSearchOverview.rejected, (state, action) => {
      state.overviewLoading = false;
      state.error = action.payload as string;
    });

    // Posts
    builder.addCase(fetchSearchPosts.pending, (state, action) => {
      if (action.meta.arg.page === 1) {
        state.loading = true;
        state.posts = [];
      }
      state.error = null;
    });
    builder.addCase(fetchSearchPosts.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.currentPage === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      state.postsPagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        limit: action.payload.limit,
        hasNextPage: action.payload.hasNextPage,
      };
    });
    builder.addCase(fetchSearchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Users
    builder.addCase(fetchSearchUsers.pending, (state, action) => {
      if (action.meta.arg.page === 1) {
        state.loading = true;
        state.users = [];
      }
      state.error = null;
    });
    builder.addCase(fetchSearchUsers.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.currentPage === 1) {
        state.users = action.payload.users;
      } else {
        state.users = [...state.users, ...action.payload.users];
      }
      state.usersPagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        limit: action.payload.limit,
        hasNextPage: action.payload.hasNextPage,
      };
    });
    builder.addCase(fetchSearchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Tags
    builder.addCase(fetchSearchTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSearchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload.tags || [];
    });
    builder.addCase(fetchSearchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Discover
    builder.addCase(fetchDiscoverData.pending, (state) => {
      state.discoverLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDiscoverData.fulfilled, (state, action) => {
      state.discoverLoading = false;
      state.trendingPosts = action.payload.trendingPosts || [];
      state.topUsers = action.payload.topUsers || [];
      state.trendingTags = action.payload.trendingTags || [];
    });
    builder.addCase(fetchDiscoverData.rejected, (state, action) => {
      state.discoverLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const {
  setSearchQuery,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  clearSearchResults
} = searchSlice.actions;

export default searchSlice.reducer;
