import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Repository } from '../types/github';
import { colors } from '../theme/colors';

interface Props {
  repo: Repository;
  onPress: (repo: Repository) => void;
}

const formatCount = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export const RepoCard = React.memo(({ repo, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(repo)}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        {repo.owner?.avatar_url && (
          <Image source={{ uri: repo.owner.avatar_url }} style={styles.avatar} />
        )}
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{repo.name}</Text>
          <Text style={styles.fullName} numberOfLines={1}>{repo.full_name}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      {repo.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {repo.description}
        </Text>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statText}>{formatCount(repo.stargazers_count)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🍴</Text>
          <Text style={styles.statText}>{formatCount(repo.forks_count)}</Text>
        </View>
        {repo.open_issues_count > 0 && (
          <View style={styles.stat}>
            <Text style={styles.statIcon}>●</Text>
            <Text style={styles.statText}>{formatCount(repo.open_issues_count)} issues</Text>
          </View>
        )}
        {repo.language ? (
          <View style={[styles.stat, styles.langBadge]}>
            <Text style={styles.langText}>{repo.language}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
    backgroundColor: colors.surface,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  fullName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  description: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 19,
    marginBottom: 10,
    opacity: 0.85,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
    marginRight: 3,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  langBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});
