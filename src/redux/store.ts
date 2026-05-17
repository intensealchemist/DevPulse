import { configureStore } from '@reduxjs/toolkit';
import repoReducer from './slices/repoSlice';
import searchReducer from './slices/searchSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    repo: repoReducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
