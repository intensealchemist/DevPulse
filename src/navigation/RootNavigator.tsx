import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';

// Screens
import ExploreScreen from '../screens/ExploreScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Explore"
          component={ExploreScreen}
          options={{ title: 'Trending Repos' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ title: 'Saved Repos' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.repo.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
