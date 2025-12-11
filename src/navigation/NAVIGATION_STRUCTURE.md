# 📱 Estructura de Navegación - App Navigator

## 🎯 Problema Resuelto
Anteriormente, al navegar desde **ClubsScreen** → **ClubDetail** → **JugadoresClub** y deslizar para volver, la app te devolvía incorrectamente al **HomeScreen** en lugar de regresar progresivamente.

## ✅ Solución Implementada
Cada **Stack** ahora contiene todas las pantallas relacionadas que pueden ser accedidas desde ese tab, permitiendo una navegación fluida y lógica.

---

## 📚 Estructura Actual de Stacks

### 🏠 **HomeStack** (Tab: Inicio)
```
HomeMain (HomeScreen)
  └─→ ClubDetail (ClubDetailScreen)
       ├─→ PartidosActivosClub
       ├─→ JugadoresClub
       │    └─→ PlayerProfile
       └─→ PlayerProfile
```

**Flujo de navegación:**
- Home → Club → Partidos ✅
- Home → Club → Jugadores → Perfil ✅
- Deslizar vuelve paso a paso correctamente ✅

---

### 🏛️ **ClubsStack** (Tab: Clubes)
```
ClubsMain (ClubsScreen)
  └─→ ClubDetail (ClubDetailScreen)
       ├─→ PartidosActivosClub
       ├─→ JugadoresClub
       │    └─→ PlayerProfile
       └─→ PlayerProfile
```

**Flujo de navegación:**
- Clubes → Club Detail → Partidos ✅
- Clubes → Club Detail → Jugadores → Perfil ✅
- Deslizar vuelve a Clubes (NO a Home) ✅

---

### ⚽ **MatchesStack** (Tab: Partidos)
```
MatchesMain (MatchesScreen)
  └─→ (Pantallas futuras de partidos)
```

---

### 👥 **PlayersStack** (Tab: Jugadores)
```
PlayersMain (PlayersScreen)
  └─→ PlayerProfile (PlayerProfileScreen)
```

**Flujo de navegación:**
- Jugadores → Perfil ✅
- Deslizar vuelve a Jugadores ✅

---

## 🔑 Pantallas Compartidas

Algunas pantallas están **duplicadas en múltiples stacks** para mantener el contexto de navegación correcto:

| Pantalla | HomeStack | ClubsStack | PlayersStack |
|----------|-----------|------------|--------------|
| `ClubDetail` | ✅ | ✅ | ❌ |
| `PartidosActivosClub` | ✅ | ✅ | ❌ |
| `JugadoresClub` | ✅ | ✅ | ❌ |
| `PlayerProfile` | ✅ | ✅ | ✅ |

---

## 🎨 Beneficios de esta Estructura

### ✅ Navegación Contextual
- Cada tab mantiene su propio historial de navegación
- Al cambiar de tab y volver, mantienes tu posición

### ✅ Flujo Intuitivo
- Deslizar hacia atrás te lleva al paso anterior **dentro del mismo tab**
- No hay saltos inesperados entre tabs

### ✅ Escalabilidad
- Fácil agregar nuevas pantallas a cada stack
- Mantiene el código organizado por feature/módulo

---

## 📝 Ejemplo de Uso

### Desde Tab "Clubes":
```
1. Usuario en ClubsScreen
2. Toca un club → Va a ClubDetail
3. Toca "Ver Jugadores" → Va a JugadoresClub
4. Toca un jugador → Va a PlayerProfile
5. Desliza para volver ← JugadoresClub
6. Desliza para volver ← ClubDetail
7. Desliza para volver ← ClubsScreen ✅
```

### Desde Tab "Home":
```
1. Usuario en HomeScreen
2. Toca un club → Va a ClubDetail
3. Toca "Ver Partidos" → Va a PartidosActivosClub
4. Desliza para volver ← ClubDetail
5. Desliza para volver ← HomeScreen ✅
```

---

## 🚀 Navegación Programática

Para navegar entre pantallas dentro del mismo stack:

```javascript
// Desde ClubsScreen a ClubDetail
navigation.navigate('ClubDetail', { club });

// Desde ClubDetail a JugadoresClub
navigation.navigate('JugadoresClub', { club });

// Desde JugadoresClub a PlayerProfile
navigation.navigate('PlayerProfile', { player });

// Volver un paso atrás
navigation.goBack();
```

---

**Última actualización**: 2025-11-21
