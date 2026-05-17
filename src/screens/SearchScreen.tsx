import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { RepoCard } from '../components/RepoCard';
import { LoadingFooter } from '../components/LoadingFooter';
import { ErrorView } from '../components/ErrorView';
import { useDebounce } from '../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { executeSearch, clearSearch } from '../redux/slices/searchSlice';
import { SearchScreenNavigationProp } from '../navigation/types';
import { Repository } from '../types/github';

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen = ({ navigation }: Props) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const dispatch = useAppDispatch();
  const { items, loading, error, currentPage, hasMore } = useAppSelector(state => state.search);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(executeSearch({ query: debouncedQuery, page: 1 }));
    } else {
      dispatch(clearSearch());
    }
  }, [debouncedQuery, dispatch]);

  const handleLoadMore = () => {
    if (!loading && hasMore && debouncedQuery) {
      dispatch(executeSearch({ query: debouncedQuery, page: currentPage + 1 }));
    }
  };

  const navigateToDetails = useCallback((repo: Repository) => {
    navigation.navigate('Details', { repo });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={setQuery} />
      
      {error && items.length === 0 ? (
        <ErrorView message={error} onRetry={() => dispatch(executeSearch({ query: debouncedQuery, page: 1 }))} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <RepoCard repo={item} onPress={navigateToDetails} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadingFooter loading={loading && items.length > 0} />}
          windowSize={10}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default SearchScreen;
