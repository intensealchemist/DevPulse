import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Repository } from '../types/github';

export type RootStackParamList = {
  Explore: undefined;
  Search: undefined;
  Favorites: undefined;
  Details: { repo: Repository };
};

export type ExploreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Explore'>;
export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;
export type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;
export type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;
export type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
