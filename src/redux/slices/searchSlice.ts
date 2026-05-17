import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchRepos } from '../../api/github';
import { Repository } from '../../types/github';

export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const data = await searchRepos(query, page);
      return { items: data.items, query, page, total_count: data.total_count };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

interface SearchState {
  items: Repository[];
  query: string;
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: SearchState = {
  items: [],
  query: '',
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch(state) {
      state.items = [];
      state.query = '';
      state.currentPage = 1;
      state.hasMore = false;
    }
  },
  extraReducers: (builder) => {
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
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
