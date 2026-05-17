import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = 'Search repositories...' }: Props) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputWrapper} activeOpacity={1} onPress={() => inputRef.current?.focus()}>
        <Text style={styles.icon}>⌕</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  icon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  clear: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingLeft: 8,
  },
});
