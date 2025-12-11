import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// ========================================
// IMPORTAR PANTALLAS PRINCIPALES (TABS)
// ========================================
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import MatchesScreen from "../screens/MatchesScreen/MatchesScreen";
import PlayersScreen from "../screens/PlayerScreen/PlayersScreen";
import ClubsScreen from "../screens/ClubScreen/ClubsScreen";
import InfoScreen from "../screens/InfoScreen";
import RankingScreen from "../screens/RankingScreen";
import LoginScreen from "../screens/LoginScreen";

// ========================================
// IMPORTAR PANTALLAS DEL HOME STACK
// Estas pantallas se muestran DENTRO del stack de Home
// manteniendo el Header y Footer fijos
// ========================================
import ClubDetailScreen from "../screens/ClubScreen/ClubDetailScreen";
import PlayerProfileScreen from "../screens/PlayerScreen/PlayerProfileScreen";
import PartidosActivosClub from "../screens/ClubScreen/PartidosActivosClub";
import JugadoresClub from "../screens/ClubScreen/JugadoresClub";
// AGREGAR MÁS PANTALLAS AQUÍ:
// import ClubPlayersScreen from "../screens/HomeScreen/screens/ClubPlayersScreen";
// import ClubStatsScreen from "../screens/HomeScreen/screens/ClubStatsScreen";

import MatchDetailScreen from "../screens/MatchesScreen/MatchDetailScreen";

// ========================================
// IMPORTAR COMPONENTES COMUNES
// ========================================
import Header from "../components/common/Header";

// ========================================
// CREAR NAVEGADORES
// ========================================
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ========================================
// STACK NAVIGATOR PARA HOME
// ========================================
// Este stack contiene todas las pantallas relacionadas con Home:
// - Lista de clubes (pantalla principal)
// - Detalles de un club
// - Partidos de un club
// - Cualquier otra vista relacionada con clubes
// ========================================
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos el header interno porque usamos el Header fijo
        cardStyle: { backgroundColor: 'white' }, // Fondo blanco para todas las pantallas
      }}
    >
      {/* PANTALLA PRINCIPAL: Home/Inicio */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: "Inicio",
        }}
      />

      {/* PANTALLA: Detalles de un club específico */}
      <Stack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{
          title: "Detalles del Club",
        }}
      />

      {/* PANTALLA: Partidos activos del club */}
      <Stack.Screen
        name="PartidosActivosClub"
        component={PartidosActivosClub}
        options={{
          title: "Partidos Activos",
        }}
      />

      {/* PANTALLA: Jugadores del club */}
      <Stack.Screen
        name="JugadoresClub"
        component={JugadoresClub}
        options={{
          title: "Jugadores del Club",
        }}
      />


    </Stack.Navigator>
  );
}

function ClubsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      {/* PANTALLA PRINCIPAL: Lista de clubes */}
      <Stack.Screen
        name="ClubsMain"
        component={ClubsScreen}
        options={{ title: "Clubes" }}
      />

      {/* PANTALLA: Detalles de un club */}
      <Stack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{
          title: "Detalles del Club",
        }}
      />

      {/* PANTALLA: Partidos activos del club */}
      <Stack.Screen
        name="PartidosActivosClub"
        component={PartidosActivosClub}
        options={{
          title: "Partidos Activos",
        }}
      />

      {/* PANTALLA: Jugadores del club */}
      <Stack.Screen
        name="JugadoresClub"
        component={JugadoresClub}
        options={{
          title: "Jugadores del Club",
        }}
      />

      {/* PANTALLA: Perfil de jugador (para ver desde jugadores del club) */}
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfileScreen}
        options={{
          title: "Perfil del Jugador",
        }}
      />
    </Stack.Navigator>
  );
}


// ========================================
// STACK NAVIGATOR PARA PARTIDOS
// ========================================
// Aquí puedes agregar pantallas relacionadas con partidos:
// - Lista de partidos (pantalla principal)
// - Detalles de un partido
// - Crear nuevo partido
// - Editar partido
// ========================================
function MatchesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      {/* PANTALLA PRINCIPAL: Lista de partidos */}
      <Stack.Screen
        name="MatchesMain"
        component={MatchesScreen}
        options={{ title: "Partidos" }}
      />

      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ title: "Detalle del Partido" }}
      />
      {/* AGREGAR MÁS PANTALLAS AQUÍ:
      

      <Stack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ title: "Crear Partido" }}
      />
      
      */}
    </Stack.Navigator>
  );
}

// ========================================
// STACK NAVIGATOR PARA JUGADORES
// ========================================
// Aquí puedes agregar pantallas relacionadas con jugadores:
// - Lista de jugadores (pantalla principal)
// - Perfil de un jugador
// - Estadísticas del jugador
// ========================================
function PlayersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      {/* PANTALLA PRINCIPAL: Lista de jugadores */}
      <Stack.Screen
        name="PlayersMain"
        component={PlayersScreen}
        options={{ title: "Jugadores" }}
      />

      {/* PANTALLA: Perfil del jugador */}
      <Stack.Screen
        name="PlayerProfile"
        component={PlayerProfileScreen}
        options={{
          title: "Perfil del Jugador",
        }}
      />
    </Stack.Navigator>
  );
}

// ========================================
// STACK NAVIGATOR PARA INFORMACIÓN
// ========================================
function InfoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="InfoMain"
        component={InfoScreen}
        options={{ title: "Información" }}
      />
    </Stack.Navigator>
  );
}

// ========================================
// STACK NAVIGATOR PARA RANKING
// ========================================
function RankingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="RankingMain"
        component={RankingScreen}
        options={{ title: "Ranking" }}
      />
    </Stack.Navigator>
  );
}


// ========================================
// TAB NAVIGATOR (FOOTER)
// ========================================
// Este componente renderiza:
// 1. Header fijo en la parte superior (visible en todas las tabs)
// 2. Tab Navigator (contenido que cambia según la tab seleccionada)
// 3. Footer con íconos (visible en todas las tabs)
//
// IMPORTANTE: Cada tab tiene su propio Stack Navigator, lo que permite
// navegar entre pantallas DENTRO de cada tab sin perder el Header y Footer
// ========================================
function MainTabs() {
  return (
    <View style={styles.container}>
      {/* ====================================
          STATUS BAR - Configuración general
          ==================================== */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4CAF50"
        translucent={false}
      />

      {/* ====================================
          HEADER FIJO - Visible en todas las tabs
          ==================================== */}
      <Header />

      {/* ====================================
          TAB NAVIGATOR - Contenido + Footer
          ==================================== */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Configurar íconos del footer según la tab
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Determinar el ícono según la ruta
            if (route.name === "Inicio") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Partidos") {
              iconName = focused ? "tennisball" : "tennisball-outline";
            } else if (route.name === "Jugadores") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Clubes") {
              iconName = focused ? "tennisball" : "tennisball-outline";

            } else if (route.name === "Información") {
              iconName = focused
                ? "information-circle"
                : "information-circle-outline";
            } else if (route.name === "Ranking") {
              iconName = focused ? "trophy" : "trophy-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // Colores del footer
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
          headerShown: false, // Ocultar headers internos de las tabs
        })}
      >
        {/* TAB: Inicio (con su propio Stack) */}
        <Tab.Screen name="Inicio" component={HomeStack} />

        {/* TAB: Partidos (con su propio Stack) */}
        <Tab.Screen name="Partidos" component={MatchesStack} />

        {/* TAB: Jugadores (con su propio Stack) */}
        <Tab.Screen name="Jugadores" component={PlayersStack} />

        <Tab.Screen name="Clubes" component={ClubsStack} />

        {/* TAB: Información (con su propio Stack) */}
        <Tab.Screen
          name="Información"
          component={InfoStack}
          options={{
            headerShown: false,
            title: "Información",
            headerStyle: {
              backgroundColor: "#4CAF50",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />

        {/* TABS DESHABILITADAS (descomentar si las necesitas):
        
        <Tab.Screen name="Ranking" component={RankingStack} />
        
        */}
      </Tab.Navigator>
    </View>
  );
}


// ========================================
// NAVEGADOR PRINCIPAL DE LA APLICACIÓN
// ========================================
// Este es el navegador raíz que contiene:
// 1. MainTabs (con Header + Footer fijos)
// 2. Pantallas modales (como Login) que se muestran sobre las tabs
// ========================================
export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Sin headers por defecto
          }}
        >
          {/* ====================================
              PANTALLA PRINCIPAL CON TABS
              Incluye Header fijo + Tabs + Footer
              ==================================== */}
          <Stack.Screen name="MainTabs" component={MainTabs} />

          {/* ====================================
              PANTALLAS MODALES
              Se muestran sobre la navegación principal
              ==================================== */}

          {/* Modal: Login */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              presentation: "modal", // Se muestra como modal
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

          {/* AGREGAR MÁS MODALES AQUÍ:
          
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              presentation: "modal",
              headerShown: true,
              title: "Configuración",
            }}
          />
          
          */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ========================================
// ESTILOS
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
