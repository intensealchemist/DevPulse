import AsyncStorage from '@react-native-async-storage/async-storage';
import { Repository } from '../types/github';

const FAVORITES_KEY = '@devpulse_favorites';

export const saveFavorites = async (favorites: Repository[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites', error);
  }
};

export const loadFavorites = async (): Promise<Repository[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load favorites', error);
  }
  return [];
};
