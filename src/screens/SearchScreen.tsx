import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SearchBar } from '../components/SearchBar';
import { RepoCard } from '../components/RepoCard';
import { UserCard } from '../components/UserCard';
import { LoadingFooter } from '../components/LoadingFooter';
import { ErrorView } from '../components/ErrorView';
import { useDebounce } from '../hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { executeSearch, executeUserSearch, clearSearch, setSearchType } from '../redux/slices/searchSlice';
import { SearchScreenNavigationProp } from '../navigation/types';
import { Repository, GithubUser } from '../types/github';
import { colors } from '../theme/colors';

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen = ({ navigation }: Props) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const dispatch = useAppDispatch();
  const { 
    searchType, 
    items, 
    userItems, 
    loading, 
    error, 
    currentPage, 
    hasMore,
    userCurrentPage,
    userHasMore
  } = useAppSelector(state => state.search);

  // Sync Redux clear if input wipes
  useEffect(() => {
    if (!debouncedQuery) {
      dispatch(clearSearch());
    }
  }, [debouncedQuery, dispatch]);

  // Execute Search Effect
  useEffect(() => {
    if (debouncedQuery) {
      if (searchType === 'repos') {
        dispatch(executeSearch({ query: debouncedQuery, page: 1 }));
      } else {
        dispatch(executeUserSearch({ query: debouncedQuery, page: 1 }));
      }
    }
  }, [debouncedQuery, searchType, dispatch]);

  const handleLoadMore = () => {
    if (!loading && debouncedQuery) {
      if (searchType === 'repos' && hasMore) {
        dispatch(executeSearch({ query: debouncedQuery, page: currentPage + 1 }));
      } else if (searchType === 'users' && userHasMore) {
        dispatch(executeUserSearch({ query: debouncedQuery, page: userCurrentPage + 1 }));
      }
    }
  };

  const navigateToDetails = useCallback((repo: Repository) => {
    navigation.navigate('Details', { repo });
  }, [navigation]);

  const renderHeaderToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[styles.toggleButton, searchType === 'repos' && styles.toggleActive]}
        onPress={() => dispatch(setSearchType('repos'))}
        activeOpacity={0.8}
      >
        <Text style={[styles.toggleText, searchType === 'repos' && styles.toggleTextActive]}>Repositories</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton, searchType === 'users' && styles.toggleActive]}
        onPress={() => dispatch(setSearchType('users'))}
        activeOpacity={0.8}
      >
        <Text style={[styles.toggleText, searchType === 'users' && styles.toggleTextActive]}>Developers</Text>
      </TouchableOpacity>
    </View>
  );

  const activeData = searchType === 'repos' ? items : userItems;

  return (
    <View style={styles.container}>
      {renderHeaderToggle()}
      <SearchBar 
        value={query} 
        onChangeText={setQuery} 
        placeholder={`Search ${searchType === 'repos' ? 'repositories' : 'developers'}...`} 
      />
      
      {error && activeData.length === 0 ? (
        <ErrorView 
          message={error} 
          onRetry={() => {
            if (searchType === 'repos') dispatch(executeSearch({ query: debouncedQuery, page: 1 }));
            else dispatch(executeUserSearch({ query: debouncedQuery, page: 1 }));
          }} 
        />
      ) : (
        <FlatList<any>
          data={activeData}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: { item: any }) => {
            if (searchType === 'repos') {
              return <RepoCard repo={item as Repository} onPress={navigateToDetails} />;
            }
            return <UserCard user={item as GithubUser} />;
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadingFooter loading={loading && activeData.length > 0} />}
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
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
});

export default SearchScreen;
