import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadTrendingRepos } from '../redux/slices/repoSlice';
import { RepoCard } from '../components/RepoCard';
import { LoadingFooter } from '../components/LoadingFooter';
import { ErrorView } from '../components/ErrorView';
import { ExploreScreenNavigationProp } from '../navigation/types';
import { Repository } from '../types/github';
import { colors } from '../theme/colors';

interface Props {
  navigation: ExploreScreenNavigationProp;
}

// Extracted to avoid unstable nested component warning
const SearchButton = React.memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.searchButton} activeOpacity={0.7}>
    <Text style={styles.searchButtonText}>{'⌕  Search'}</Text>
  </TouchableOpacity>
));

const FavoritesButton = React.memo(({ onPress, count }: { onPress: () => void; count: number }) => (
  <TouchableOpacity onPress={onPress} style={styles.favButton} activeOpacity={0.7}>
    <Text style={styles.favButtonText}>{count > 0 ? `♥ ${count}` : '♡'}</Text>
  </TouchableOpacity>
));

const ExploreScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { items, loading, error, currentPage, hasMore } = useAppSelector(state => state.repo);
  const favoriteCount = useAppSelector(state => state.favorites.items.length);

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const navigateToFavorites = useCallback(() => {
    navigation.navigate('Favorites');
  }, [navigation]);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(loadTrendingRepos(1));
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <FavoritesButton onPress={navigateToFavorites} count={favoriteCount} />
          <SearchButton onPress={navigateToSearch} />
        </View>
      ),
    });
  }, [dispatch, items.length, navigation, navigateToSearch, navigateToFavorites, favoriteCount]);

  const handleRefresh = useCallback(() => {
    dispatch(loadTrendingRepos(1));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadTrendingRepos(currentPage + 1));
    }
  }, [loading, hasMore, dispatch, currentPage]);

  const navigateToDetails = useCallback((repo: Repository) => {
    navigation.navigate('Details', { repo });
  }, [navigation]);

  if (error && items.length === 0) {
    return <ErrorView message={error} onRetry={() => dispatch(loadTrendingRepos(1))} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RepoCard repo={item} onPress={navigateToDetails} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingFooter loading={loading && items.length > 0} />}
        refreshControl={
          <RefreshControl
            refreshing={loading && items.length === 0}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        windowSize={10}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 8 },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  favButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExploreScreen;
