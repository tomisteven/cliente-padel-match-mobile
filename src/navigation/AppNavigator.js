import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
/* import MatchesScreen from '../screens/MatchesScreen';
import PlayersScreen from '../screens/PlayersScreen';
import ClubsScreen from '../screens/ClubsScreen';
import InfoScreen from '../screens/InfoScreen';
import RankingScreen from '../screens/RankingScreen'; */

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para cada pestaña
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/* function MatchesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ title: 'Partidos Activos' }}
      />
    </Stack.Navigator>
  );
}

function PlayersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Players"
        component={PlayersScreen}
        options={{ title: 'Jugadores' }}
      />
    </Stack.Navigator>
  );
}

function ClubsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Clubs"
        component={ClubsScreen}
        options={{ title: 'Clubes' }}
      />
    </Stack.Navigator>
  );
}

function InfoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{ title: 'Información' }}
      />
    </Stack.Navigator>
  );
}

function RankingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ title: 'Ranking' }}
      />
    </Stack.Navigator>
  );
} */

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Partidos') {
              iconName = focused ? 'tennisball' : 'tennisball-outline';
            } else if (route.name === 'Jugadores') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Clubes') {
              iconName = focused ? 'business' : 'business-outline';
            } else if (route.name === 'Información') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'Ranking') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
       {/*  <Tab.Screen name="Partidos" component={MatchesStack} />
        <Tab.Screen name="Jugadores" component={PlayersStack} />
        <Tab.Screen name="Clubes" component={ClubsStack} />
        <Tab.Screen name="Información" component={InfoStack} />
        <Tab.Screen name="Ranking" component={RankingStack} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}