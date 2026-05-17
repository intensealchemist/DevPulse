import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { GithubUser } from '../types/github';
import { colors } from '../theme/colors';

interface Props {
  user: GithubUser;
}

export const UserCard = React.memo(({ user }: Props) => {
  const openProfile = () => {
    if (user.html_url) {
      Linking.openURL(user.html_url);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={openProfile}
      activeOpacity={0.75}
    >
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>{user.login}</Text>
        <Text style={styles.urlText}>github.com/{user.login}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  urlText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chevron: {
    fontSize: 22,
    color: colors.textSecondary,
    lineHeight: 26,
  },
});
