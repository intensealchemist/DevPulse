import React, { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
import { hydrateFavorites } from './src/redux/slices/favoritesSlice';
import { setCachedRepos } from './src/redux/slices/repoSlice';
import { loadFavorites, saveFavorites } from './src/storage/favorites';
import { loadExploreCache, saveExploreCache } from './src/storage/cache';
import { useAppState } from './src/hooks/useAppState';

// A wrapper component to access Redux hooks securely inside provider
const AppContent = () => {
  const dispatch = useAppDispatch();
  const repoItems = useAppSelector(state => state.repo.items);
  const favoriteItems = useAppSelector(state => state.favorites.items);

  // Load cache when app mounts or restores
  const initCache = useCallback(async () => {
    const cachedRepos = await loadExploreCache();
    if (cachedRepos.length > 0) {
      dispatch(setCachedRepos(cachedRepos));
    }
    const cachedFavorites = await loadFavorites();
    if (cachedFavorites.length > 0) {
      dispatch(hydrateFavorites(cachedFavorites));
    }
  }, [dispatch]);

  // Persist data when going to background
  const persistCache = useCallback(() => {
    if (repoItems.length > 0) saveExploreCache(repoItems);
    saveFavorites(favoriteItems);
  }, [repoItems, favoriteItems]);

  useEffect(() => {
    initCache();
  }, [initCache]);

  useAppState(
    // onForeground
    () => {
      // Re-hydrate gently if needed or run a fetch refresh
      console.log('App Foregrounded');
    },
    // onBackground
    () => {
      persistCache();
      console.log('App Backgrounded, Cache Persisted');
    }
  );

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
