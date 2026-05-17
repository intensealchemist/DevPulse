import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Repository } from '../../types/github';

interface FavoritesState {
  items: Repository[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    hydrateFavorites(state, action: PayloadAction<Repository[]>) {
      state.items = action.payload;
    },
    addFavorite(state, action: PayloadAction<Repository>) {
      if (!state.items.some(repo => repo.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<number>) {
      state.items = state.items.filter(repo => repo.id !== action.payload);
    }
  },
});

export const { hydrateFavorites, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
