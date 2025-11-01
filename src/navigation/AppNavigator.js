import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Importar pantallas principales
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen";
import PlayersScreen from "../screens/PlayersScreen";
import ClubsScreen from "../screens/ClubsScreen";
import InfoScreen from "../screens/InfoScreen";
import RankingScreen from "../screens/RankingScreen";
import LoginScreen from "../screens/LoginScreen";

// Importar Header
import Header from "../components/common/Header";

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

function MatchesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Tab Navigator con Header personalizado
function MainTabs() {
  return (
    <View style={styles.container}>
      {/* Configurar StatusBar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4CAF50"
        translucent={false}
      />

      {/* Header fijo arriba de TODO */}
      <Header />

      {/* Tabs (Footer con iconos) */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Inicio") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Partidos") {
              iconName = focused ? "tennisball" : "tennisball-outline";
            } else if (route.name === "Jugadores") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Clubes") {
              iconName = focused ? "business" : "business-outline";
            } else if (route.name === "Información") {
              iconName = focused
                ? "information-circle"
                : "information-circle-outline";
            } else if (route.name === "Ranking") {
              iconName = focused ? "trophy" : "trophy-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
          headerShown: false, // Ocultar headers de las tabs
        })}
      >
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Partidos" component={MatchesStack} />
        <Tab.Screen name="Jugadores" component={PlayersStack} />
        <Tab.Screen name="Clubes" component={ClubsStack} />
        <Tab.Screen name="Información" component={InfoStack} />
        {/* <Tab.Screen name="Ranking" component={RankingStack} /> */}
      </Tab.Navigator>
    </View>
  );
}

// Navegador principal
export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Pantalla principal con tabs (Header + Footer) */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
          />

          {/* Login como modal - accesible desde cualquier lugar */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              title: "Iniciar Sesión",
              headerStyle: {
                backgroundColor: "#4CAF50",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});