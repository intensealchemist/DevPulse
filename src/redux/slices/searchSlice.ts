import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchRepos, searchUsers } from '../../api/github';
import { Repository, GithubUser } from '../../types/github';

export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const data = await searchRepos(query, page);
      return { items: data.items, query, page, total_count: data.total_count };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Repo search failed');
    }
  }
);

export const executeUserSearch = createAsyncThunk(
  'search/executeUserSearch',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const data = await searchUsers(query, page);
      return { items: data.items, query, page, total_count: data.total_count };
    } catch (error: any) {
      return rejectWithValue(error.message || 'User search failed');
    }
  }
);

interface SearchState {
  searchType: 'repos' | 'users';
  query: string;
  loading: boolean;
  error: string | null;
  
  // Repo state
  items: Repository[];
  currentPage: number;
  hasMore: boolean;

  // User state
  userItems: GithubUser[];
  userCurrentPage: number;
  userHasMore: boolean;
}

const initialState: SearchState = {
  searchType: 'repos',
  query: '',
  loading: false,
  error: null,
  
  items: [],
  currentPage: 1,
  hasMore: false,

  userItems: [],
  userCurrentPage: 1,
  userHasMore: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch(state) {
      state.items = [];
      state.userItems = [];
      state.query = '';
      state.currentPage = 1;
      state.userCurrentPage = 1;
      state.hasMore = false;
      state.userHasMore = false;
    },
    setSearchType(state, action: PayloadAction<'repos' | 'users'>) {
      state.searchType = action.payload;
    }
  },
  extraReducers: (builder) => {
    // REPO SEARCH
    builder
      .addCase(executeSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        
        if (action.payload.page === 1) {
          state.items = action.payload.items;
        } else {
          const newItems = action.payload.items.filter(
            item => !state.items.some(exist => exist.id === item.id)
          );
          state.items = [...state.items, ...newItems];
        }
        
        state.currentPage = action.payload.page;
        state.hasMore = state.items.length < action.payload.total_count;
      })
      .addCase(executeSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // USER SEARCH
      .addCase(executeUserSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeUserSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        
        if (action.payload.page === 1) {
          state.userItems = action.payload.items;
        } else {
          const newItems = action.payload.items.filter(
            item => !state.userItems.some(exist => exist.id === item.id)
          );
          state.userItems = [...state.userItems, ...newItems];
        }
        
        state.userCurrentPage = action.payload.page;
        state.userHasMore = state.userItems.length < action.payload.total_count;
      })
      .addCase(executeUserSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch, setSearchType } = searchSlice.actions;
export default searchSlice.reducer;
