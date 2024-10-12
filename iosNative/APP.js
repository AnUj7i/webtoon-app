import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

s
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CategoryItem from '../components/CategoryItem';
import WebtoonService from '../services/WebtoonService';

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const fetchedCategories = await WebtoonService.getCategories();
    setCategories(fetchedCategories);
  };

  const renderCategoryItem = ({ item }) => (
    <CategoryItem
      category={item}
      onPress={() => navigation.navigate('Detail', { categoryId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
  },
});

export default HomeScreen;


import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryItem = ({ category, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: category.thumbnailURL }} style={styles.image} />
      <Text style={styles.title}>{category.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CategoryItem;

// src/services/WebtoonService.js
import { storeData, getData } from '../utils/storage';

const WebtoonService = {
  getCategories: async () => {
    // Simulated API call
    return [
      { id: '1', title: 'Action', thumbnailURL: 'https://example.com/action.jpg' },
      { id: '2', title: 'Romance', thumbnailURL: 'https://example.com/romance.jpg' },
      
    ];
  },

  getWebtoon: async (categoryId) => {
   
    return {
      id: '101',
      title: 'Lore Olympus',
      description: 'A modern retelling of the story of Persephone and Hades.',
      imageURL: 'https://example.com/lore-olympus.jpg',
    };
  },

  toggleFavorite: async (webtoonId) => {
    const favorites = await getData('favorites') || [];
    const index = favorites.indexOf(webtoonId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(webtoonId);
    }
    await storeData('favorites', favorites);
    return favorites;
  },

  getFavorites: async () => {
    return await getData('favorites') || [];
  },

  rateWebtoon: async (webtoonId, rating) => {
    const ratings = await getData('ratings') || {};
    ratings[webtoonId] = rating;
    await storeData('ratings', ratings);
    return ratings;
  },

  getWebtoonRating: async (webtoonId) => {
    const ratings = await getData('ratings') || {};
    return ratings[webtoonId] || 0;
  },
};

export default WebtoonService;

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};
