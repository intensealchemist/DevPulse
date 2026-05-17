import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  loading: boolean;
}

export const LoadingFooter = ({ loading }: Props) => {
  if (!loading) return null;
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
