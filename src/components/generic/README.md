# Componentes Genéricos Reutilizables

Esta carpeta contiene componentes genéricos y reutilizables que se pueden usar en toda la aplicación para mantener un diseño consistente y reducir la duplicación de código.

## 📦 Componentes Disponibles

### 1. **PlayerCard**
Componente para mostrar información de un jugador en formato de tarjeta.

#### Props:
- `player` (Object): Objeto del jugador con sus datos
- `onPress` (Function): Función que se ejecuta al presionar la card
- `onActionPress` (Function, opcional): Función que se ejecuta al presionar el botón de acción
- `actionIcon` (String, default: 'eye'): Nombre del ícono de Ionicons para el botón de acción

#### Uso:
```javascript
import { PlayerCard } from '../../components/generic';

<PlayerCard
  player={playerObject}
  onPress={(player) => navigation.navigate('PlayerProfile', { player })}
  onActionPress={(player) => console.log('Action:', player)}
  actionIcon="eye"
/>
```

---

### 2. **ClubCard**
Componente para mostrar información de un club en formato de tarjeta.

#### Props:
- `club` (Object): Objeto del club con sus datos
- `onPress` (Function): Función que se ejecuta al presionar la card
- `showDistance` (Boolean, default: false): Si se debe mostrar la distancia
- `ubicacionUsuario` (Object, opcional): Objeto con latitude y longitude del usuario

#### Uso:
```javascript
import { ClubCard } from '../../components/generic';

<ClubCard
  club={clubObject}
  onPress={(club) => navigation.navigate('ClubDetail', { club })}
  showDistance={true}
  ubicacionUsuario={{ latitude: -34.9, longitude: -56.1 }}
/>
```

---

### 3. **PartidoCard**
Componente para mostrar información de un partido en formato de tarjeta.

#### Props:
- `partido` (Object): Objeto del partido con sus datos
- `index` (Number, default: 0): Índice delpartido en la lista (para mostrar número)
- `onPress` (Function): Función que se ejecuta al presionar la card
- `onJoin` (Function): Función que se ejecuta al presionar "Unirse"
- `isSelected` (Boolean, default: false): Si el partido está seleccionado visualmente

#### Uso:
```javascript
import { PartidoCard } from '../../components/generic';

<PartidoCard
  partido={partidoObject}
  index={0}
  onPress={(partido) => console.log('Selected:', partido)}
  onJoin={(partido) => handleJoinPartido(partido._id)}
  isSelected={selectedP artidoId === partido._id}
/>
```

---

## 🎨 Características Comunes

Todos los componentes comparten:
- ✅ Diseño moderno y consistente
- ✅ Bordes redondeados y sombras
- ✅ Colores del tema global (`colors`, `spacing`, `typography`)
- ✅ Animaciones de toque (activeOpacity)
- ✅ Responsive y adaptable
- ✅ Iconos de Ionicons

---

## 🚀 Importación Simplificada

Puedes importar todos los componentes desde un solo lugar:

```javascript
import { PlayerCard, ClubCard, PartidoCard } from '../../components/generic';
```

O importar componentes individuales:

```javascript
import PlayerCard from '../../components/generic/PlayerCard';
```

---

## 📝 Notas para Desarrolladores

- Todos los estilos son modulares y están contenidos dentro de cada componente
- Los componentes utilizan los estilos globales de `src/styles/global.js`
- Si necesitas personalizar un componente, puedes extenderlo o crear una variante
- Mantén la consistencia visual al agregar nuevos componentes genéricos

---

## 🔧 Mantenimiento

Para modificar el diseño de todos los componentes del mismo tipo en la app:
1. Edita el componente genérico correspondiente en esta carpeta
2. Los cambios se aplicarán automáticamente en toda la aplicación
3. No es necesario modificar cada screen individualmente

---

**Última actualización**: 2025-11-21
