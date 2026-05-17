import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrendingRepos } from '../../api/github';
import { Repository } from '../../types/github';

export const loadTrendingRepos = createAsyncThunk(
  'repo/loadTrending',
  async (page: number, { rejectWithValue }) => {
    try {
      const data = await fetchTrendingRepos(page);
      return { items: data.items, page, total_count: data.total_count };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load trending repos');
    }
  }
);

interface RepoState {
  items: Repository[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: RepoState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
};

const repoSlice = createSlice({
  name: 'repo',
  initialState,
  reducers: {
    setCachedRepos(state, action) {
      // Used to restore data from AsyncStorage
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTrendingRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTrendingRepos.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.page === 1) {
          state.items = action.payload.items;
        } else {
          // Append new items preventing duplicates
          const newItems = action.payload.items.filter(
            item => !state.items.some(exist => exist.id === item.id)
          );
          state.items = [...state.items, ...newItems];
        }
        
        state.currentPage = action.payload.page;
        state.hasMore = state.items.length < action.payload.total_count;
      })
      .addCase(loadTrendingRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCachedRepos } = repoSlice.actions;
export default repoSlice.reducer;
