import React, { useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { DetailsScreenNavigationProp, DetailsScreenRouteProp } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { colors } from '../theme/colors';

interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

// Extracted to avoid unstable nested component warning
const FavoriteButton = React.memo(
  ({ isFavorite, onPress }: { isFavorite: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.favButton} activeOpacity={0.7}>
      <Text style={styles.favButtonText}>{isFavorite ? '♥ Saved' : '♡ Save'}</Text>
    </TouchableOpacity>
  ),
);

const DetailsScreen = ({ navigation, route }: Props) => {
  const { repo } = route.params;
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.items);

  const isFavorite = favorites.some(fav => fav.id === repo.id);

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      dispatch(removeFavorite(repo.id));
    } else {
      dispatch(addFavorite(repo));
    }
  }, [isFavorite, dispatch, repo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <FavoriteButton isFavorite={isFavorite} onPress={toggleFavorite} />,
    });
  }, [navigation, isFavorite, toggleFavorite]);

  const openLink = useCallback(() => {
    if (repo.html_url) {
      Linking.openURL(repo.html_url);
    }
  }, [repo.html_url]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>{repo.name}</Text>
        <Text style={styles.fullName}>{repo.full_name}</Text>
        {repo.description ? (
          <Text style={styles.description}>{repo.description}</Text>
        ) : null}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{formatCount(repo.stargazers_count)}</Text>
          <Text style={styles.statLabel}>Stars</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🍴</Text>
          <Text style={styles.statValue}>{formatCount(repo.forks_count)}</Text>
          <Text style={styles.statLabel}>Forks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>●</Text>
          <Text style={styles.statValue}>{formatCount(repo.open_issues_count)}</Text>
          <Text style={styles.statLabel}>Issues</Text>
        </View>
        {repo.language ? (
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>{'</>'}</Text>
            <Text style={styles.statValue} numberOfLines={1}>{repo.language}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>
        ) : null}
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.button} onPress={openLink} activeOpacity={0.8}>
        <Text style={styles.buttonText}>View on GitHub →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  fullName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statBox: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Header favorite button
  favButton: {
    marginRight: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default DetailsScreen;
