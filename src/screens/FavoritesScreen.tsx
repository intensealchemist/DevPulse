import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { removeFavorite } from '../redux/slices/favoritesSlice';
import { RepoCard } from '../components/RepoCard';
import { Repository } from '../types/github';
import { FavoritesScreenNavigationProp } from '../navigation/types';
import { colors } from '../theme/colors';

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

const EmptyFavorites = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>♡</Text>
    <Text style={styles.emptyTitle}>No Saved Repos</Text>
    <Text style={styles.emptySubtitle}>
      Tap the Save button on any repository to bookmark it here.
    </Text>
  </View>
);

const FavoritesScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);

  const navigateToDetails = useCallback(
    (repo: Repository) => {
      navigation.navigate('Details', { repo });
    },
    [navigation],
  );

  const handleRemove = useCallback(
    (id: number) => {
      dispatch(removeFavorite(id));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: Repository }) => (
      <View>
        <RepoCard repo={item} onPress={navigateToDetails} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.removeText}>✕ Remove</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigateToDetails, handleRemove],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyFavorites />}
        contentContainerStyle={favorites.length === 0 ? styles.centered : styles.list}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 8 },
  centered: { flex: 1 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 56,
    color: colors.primary,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: -4,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.error,
  },
  removeText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
});

export default FavoritesScreen;
