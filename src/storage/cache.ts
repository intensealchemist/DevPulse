import AsyncStorage from '@react-native-async-storage/async-storage';
import { Repository } from '../types/github';

const CACHE_KEY = '@devpulse_explore_cache';

export const saveExploreCache = async (repos: Repository[]) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(repos));
  } catch (error) {
    console.error('Failed to save cache', error);
  }
};

export const loadExploreCache = async (): Promise<Repository[]> => {
  try {
    const data = await AsyncStorage.getItem(CACHE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load cache', error);
  }
  return [];
};
