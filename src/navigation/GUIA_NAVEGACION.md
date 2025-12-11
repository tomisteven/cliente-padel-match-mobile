# 📱 Guía de Navegación - Padel Match App

## 📂 Estructura de Navegación

Tu aplicación tiene una estructura de navegación de 3 niveles:

```
AppNavigator (Root Stack)
└── MainTabs (Tab Navigator - Header y Footer FIJOS)
    ├── HomeStack (Stack Navigator)
    │   ├── HomeMain (pantalla principal)
    │   ├── ClubDetail (detalles de club)
    │   └── [AGREGAR MÁS PANTALLAS AQUÍ]
    ├── MatchesStack (Stack Navigator)
    ├── PlayersStack (Stack Navigator)
    └── InfoStack (Stack Navigator)
```

---

## ✅ Cómo Agregar una Nueva Pantalla al Home Stack

### Paso 1: Crear el archivo de la pantalla

Crea tu nueva pantalla en la carpeta: `src/screens/HomeScreen/screens/`

**Ejemplo:** `ClubMatchesScreen.js`

```javascript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../../../styles/global';

export default function ClubMatchesScreen({ route, navigation }) {
  // Obtener datos pasados desde la pantalla anterior
  const { club } = route.params;

  return (
    <View style={styles.container}>
      {/* Botón para volver atrás */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Partidos de {club.nombreClub}</Text>
        
        {/* Aquí va tu contenido */}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    marginBottom: spacing.lg,
  },
});
```

### Paso 2: Importar la pantalla en AppNavigator.js

Agrega el import en la sección de pantallas del Home Stack:

```javascript
// ========================================
// IMPORTAR PANTALLAS DEL HOME STACK
// ========================================
import ClubDetailScreen from "../screens/HomeScreen/screens/ClubDetailScreen";
import ClubMatchesScreen from "../screens/HomeScreen/screens/ClubMatchesScreen"; // ← NUEVO
```

### Paso 3: Agregar la pantalla al HomeStack

En la función `HomeStack()`, agrega tu nueva pantalla:

```javascript
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: "Inicio" }}
      />

      <Stack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{ title: "Detalles del Club" }}
      />

      {/* ← NUEVA PANTALLA */}
      <Stack.Screen
        name="ClubMatches"
        component={ClubMatchesScreen}
        options={{ title: "Partidos del Club" }}
      />
    </Stack.Navigator>
  );
}
```

### Paso 4: Navegar a la nueva pantalla

Desde `ClubDetailScreen.js` (o cualquier otra pantalla del stack), navega así:

```javascript
// Botón para ver partidos del club
<TouchableOpacity
  style={styles.primaryButton}
  onPress={() => navigation.navigate("ClubMatches", { club })}
>
  <Ionicons name="tennisball" size={20} color={colors.white} />
  <Text style={styles.primaryButtonText}>Ver Partidos</Text>
</TouchableOpacity>
```

---

## 🔄 Flujo de Navegación

```
HomeScreen
  ↓ (navigation.navigate("ClubDetail", { club }))
ClubDetailScreen
  ↓ (navigation.navigate("ClubMatches", { club }))
ClubMatchesScreen
  ↓ (navigation.navigate("MatchDetail", { match }))
MatchDetailScreen
  ↓ (navigation.goBack())
ClubMatchesScreen
```

**✅ Durante todo este flujo, el Header y Footer se mantienen fijos!**

---

## 📋 Lista de Pantallas que Puedes Crear

### Para el Home Stack:
- ✅ `ClubDetailScreen.js` (ya existe)
- `ClubMatchesScreen.js` - Lista de partidos del club
- `ClubPlayersScreen.js` - Jugadores afiliados al club
- `ClubStatsScreen.js` - Estadísticas del club
- `ClubReservationScreen.js` - Reservar cancha en el club
- `ClubReviewsScreen.js` - Reseñas del club
- `ClubGalleryScreen.js` - Galería de fotos del club

### Para el Matches Stack:
- `MatchDetailScreen.js` - Detalles de un partido
- `CreateMatchScreen.js` - Crear nuevo partido
- `JoinMatchScreen.js` - Unirse a un partido
- `EditMatchScreen.js` - Editar partido existente

### Para el Players Stack:
- `PlayerProfileScreen.js` - Perfil completo del jugador
- `PlayerStatsScreen.js` - Estadísticas del jugador
- `PlayerMatchesScreen.js` - Historial de partidos
- `PlayerRankingScreen.js` - Ranking del jugador

---

## 🎯 Reglas Importantes

1. **Header y Footer Fijos**: Todas las pantallas dentro de un Stack mantienen el Header y Footer fijos.

2. **Ubicación de Archivos**: 
   - Pantallas del Home: `src/screens/HomeScreen/screens/`
   - Pantallas de Partidos: `src/screens/MatchesScreen/screens/`
   - Pantallas de Jugadores: `src/screens/PlayersScreen/screens/`

3. **Pasar Datos**: Usa `route.params` para recibir datos:
   ```javascript
   const { club, match, player } = route.params;
   ```

4. **Volver Atrás**: Usa `navigation.goBack()` o `navigation.navigate()`:
   ```javascript
   navigation.goBack(); // Vuelve a la pantalla anterior
   navigation.navigate("HomeMain"); // Va a la pantalla principal del stack
   ```

5. **Nombres de Rutas**: Usa nombres descriptivos en PascalCase:
   - ✅ `ClubDetail`, `MatchDetail`, `PlayerProfile`
   - ❌ `screen1`, `details`, `club_screen`

---

## 🚀 Ejemplo Completo: Agregar Pantalla de Estadísticas

### 1. Crear `ClubStatsScreen.js`:
```javascript
// src/screens/HomeScreen/screens/ClubStatsScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ClubStatsScreen({ route, navigation }) {
  const { club } = route.params;

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} />
      </TouchableOpacity>
      <Text>Estadísticas de {club.nombreClub}</Text>
    </View>
  );
}
```

### 2. Importar en `AppNavigator.js`:
```javascript
import ClubStatsScreen from "../screens/HomeScreen/screens/ClubStatsScreen";
```

### 3. Agregar al `HomeStack`:
```javascript
<Stack.Screen
  name="ClubStats"
  component={ClubStatsScreen}
  options={{ title: "Estadísticas del Club" }}
/>
```

### 4. Navegar desde `ClubDetailScreen.js`:
```javascript
<TouchableOpacity
  onPress={() => navigation.navigate("ClubStats", { club })}
>
  <Text>Ver Estadísticas</Text>
</TouchableOpacity>
```

---

## ❓ Preguntas Frecuentes

**Q: ¿Por qué usar un Stack Navigator por cada tab?**  
A: Para poder navegar entre pantallas dentro de cada sección sin perder el Header y Footer.

**Q: ¿Puedo navegar de Home a Partidos?**  
A: Sí, pero perderás el historial del stack. Mejor usa las tabs del footer.

**Q: ¿Cómo paso datos entre pantallas?**  
A: Usa el segundo parámetro de `navigation.navigate()`:
```javascript
navigation.navigate("ClubDetail", { club: selectedClub, other: data });
```

**Q: ¿Puedo tener un Header diferente por pantalla?**  
A: Sí, pero se mostrará DEBAJO del Header fijo. Para mejor UX, usa el Header fijo.

---

## 📞 Estructura de Carpetas Recomendada

```
src/
├── screens/
│   ├── HomeScreen/
│   │   ├── HomeScreen.js (pantalla principal)
│   │   ├── screens/
│   │   │   ├── ClubDetailScreen.js
│   │   │   ├── ClubMatchesScreen.js
│   │   │   ├── ClubPlayersScreen.js
│   │   │   └── ClubStatsScreen.js
│   │   └── components/
│   │       ├── ClubsList.js
│   │       └── ClubCard/
│   ├── MatchesScreen/
│   │   ├── MatchesScreen.js
│   │   └── screens/
│   │       ├── MatchDetailScreen.js
│   │       └── CreateMatchScreen.js
│   └── PlayersScreen/
│       ├── PlayersScreen.js
│       └── screens/
│           └── PlayerProfileScreen.js
└── navigation/
    └── AppNavigator.js
```

---

¡Ahora estás listo para agregar todas las pantallas que necesites! 🎉
