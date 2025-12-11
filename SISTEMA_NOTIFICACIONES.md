# 📢 Sistema de Notificaciones Global

Sistema de notificaciones global para React Native que permite mostrar mensajes de éxito, error, advertencia e información desde cualquier parte de la aplicación.

## 🎯 Características

- ✅ **Global**: Accesible desde cualquier componente, hook o contexto
- 🎨 **4 tipos de notificaciones**: Success, Error, Warning, Info
- ⏱️ **Auto-dismiss**: Se cierran automáticamente después de un tiempo configurable
- 🎭 **Animaciones**: Animaciones suaves de entrada y salida
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla
- 🎨 **Diseño moderno**: Con colores e iconos según el tipo de mensaje
- ⚡ **Fácil de usar**: API simple e intuitiva

## 📦 Archivos Creados

1. **`src/contexts/NotificationContext.js`** - Context y Provider de notificaciones
2. **`src/components/common/NotificationBar.js`** - Componente visual de las notificaciones
3. **`src/utils/NotificationExamples.js`** - Guía de ejemplos de uso

## 🚀 Uso Básico

### 1. Importar el hook

```javascript
import { useNotification } from '../contexts/NotificationContext';
```

### 2. Usar en tu componente

```javascript
function MiComponente() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleAction = () => {
    showSuccess('¡Operación completada!');
  };

  return (
    <Button title="Hacer algo" onPress={handleAction} />
  );
}
```

## 📚 API Completa

### Métodos Principales

```javascript
const {
  // Métodos específicos por tipo
  showSuccess,    // Notificación de éxito (verde)
  showError,      // Notificación de error (rojo)
  showWarning,    // Notificación de advertencia (naranja)
  showInfo,       // Notificación informativa (azul)
  
  // Método genérico
  addNotification,        // Notificación personalizada
  
  // Métodos de control
  removeNotification,     // Remover una notificación específica
  clearAllNotifications,  // Limpiar todas las notificaciones
  
  // Estado
  notifications,          // Array de notificaciones activas
} = useNotification();
```

### Parámetros

#### showSuccess / showError / showWarning / showInfo

```javascript
showSuccess(mensaje, duracion?)
```

- **mensaje** (string): El texto que se mostrará
- **duracion** (number, opcional): Milisegundos antes de cerrar automáticamente

**Duraciones por defecto:**
- Success: 3000ms (3 segundos)
- Error: 4000ms (4 segundos)
- Warning: 3500ms (3.5 segundos)
- Info: 3000ms (3 segundos)

#### addNotification

```javascript
addNotification(mensaje, tipo, duracion?)
```

- **mensaje** (string): El texto que se mostrará
- **tipo** (string): 'success' | 'error' | 'warning' | 'info'
- **duracion** (number, opcional): Milisegundos antes de cerrar (default: 3000)

## 💡 Ejemplos de Uso

### Ejemplo 1: Notificaciones básicas

```javascript
function LoginScreen() {
  const { showSuccess, showError } = useNotification();

  const handleLogin = async () => {
    try {
      await loginAPI();
      showSuccess('¡Inicio de sesión exitoso!');
    } catch (error) {
      showError('Credenciales incorrectas');
    }
  };

  return <Button onPress={handleLogin} title="Login" />;
}
```

### Ejemplo 2: Duración personalizada

```javascript
function DataSyncScreen() {
  const { showInfo, showSuccess } = useNotification();

  const syncData = async () => {
    // Mostrar durante 5 segundos
    showInfo('Sincronizando datos...', 5000);
    
    await sync();
    
    showSuccess('¡Sincronización completada!', 4000);
  };

  return <Button onPress={syncData} title="Sincronizar" />;
}
```

### Ejemplo 3: Notificación persistente (no se auto-cierra)

```javascript
function ImportantMessage() {
  const { addNotification } = useNotification();

  const showImportant = () => {
    // Duración = 0 significa que no se cerrará automáticamente
    addNotification(
      'Este mensaje es importante y debe cerrarse manualmente',
      'warning',
      0
    );
  };

  return <Button onPress={showImportant} title="Mostrar mensaje" />;
}
```

### Ejemplo 4: En un Hook personalizado

```javascript
import { useNotification } from '../contexts/NotificationContext';

function useDataFetch() {
  const { showError, showSuccess } = useNotification();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Error al cargar');
      
      showSuccess('Datos cargados correctamente');
      return await response.json();
    } catch (error) {
      showError('No se pudieron cargar los datos');
      throw error;
    }
  };

  return { fetchData };
}
```

### Ejemplo 5: En un Context

```javascript
import { useNotification } from './NotificationContext';

export const UserProvider = ({ children }) => {
  const { showSuccess, showError } = useNotification();

  const updateProfile = async (data) => {
    try {
      await api.updateProfile(data);
      showSuccess('Perfil actualizado correctamente');
    } catch (error) {
      showError('Error al actualizar el perfil');
    }
  };

  return (
    <UserContext.Provider value={{ updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
```

### Ejemplo 6: Múltiples notificaciones

```javascript
function MultipleNotifications() {
  const { showInfo, showSuccess, showWarning } = useNotification();

  const handleComplexAction = async () => {
    showInfo('Iniciando proceso...');
    
    await step1();
    showSuccess('Paso 1 completado');
    
    await step2();
    showSuccess('Paso 2 completado');
    
    showWarning('Recuerda guardar los cambios');
  };

  return <Button onPress={handleComplexAction} title="Ejecutar" />;
}
```

### Ejemplo 7: Remover notificaciones programáticamente

```javascript
function ControlledNotification() {
  const { addNotification, removeNotification } = useNotification();

  const showTemporary = () => {
    // addNotification retorna el ID de la notificación
    const id = addNotification('Este mensaje se eliminará en 2 segundos', 'info', 0);
    
    // Remover después de 2 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 2000);
  };

  return <Button onPress={showTemporary} title="Mostrar temporal" />;
}
```

## 🎨 Tipos de Notificaciones

### Success (Verde)
```javascript
showSuccess('¡Operación exitosa!');
```
- Color: Verde (#10b981)
- Icono: Checkmark circle
- Uso: Confirmación de acciones exitosas

### Error (Rojo)
```javascript
showError('Algo salió mal');
```
- Color: Rojo (#ef4444)
- Icono: Close circle
- Uso: Errores y fallos

### Warning (Naranja)
```javascript
showWarning('Cuidado con esto');
```
- Color: Naranja (#f59e0b)
- Icono: Warning
- Uso: Advertencias y precauciones

### Info (Azul)
```javascript
showInfo('Información útil');
```
- Color: Azul (#3b82f6)
- Icono: Information circle
- Uso: Mensajes informativos generales

## ⚙️ Configuración

El sistema ya está integrado en tu aplicación:

1. ✅ **NotificationProvider** está en `AppContext.js`
2. ✅ **NotificationBar** está en `AuthWrapper.js`
3. ✅ Ya puedes usar en cualquier componente

## 🔧 Personalización

### Cambiar duración por defecto

Edita `src/contexts/NotificationContext.js`:

```javascript
const showSuccess = useCallback((message, duration = 5000) => { // Cambia aquí
  return addNotification(message, "success", duration);
}, [addNotification]);
```

### Cambiar colores

Edita `src/components/common/NotificationBar.js` en la función `getNotificationConfig`:

```javascript
case "success":
  return {
    backgroundColor: "#TU_COLOR_AQUI",
    icon: "checkmark-circle",
    borderColor: "#TU_BORDER_AQUI",
  };
```

### Cambiar posición

Edita los estilos en `NotificationBar.js`:

```javascript
container: {
  position: "absolute",
  top: 50,        // Cambia esta posición
  left: 0,
  right: 0,
  zIndex: 9999,
  paddingHorizontal: 16,
},
```

## 📝 Notas Importantes

1. **No necesitas importar `Alert`** de React Native para mostrar mensajes
2. Las notificaciones se muestran **encima de todo el contenido** (zIndex: 9999)
3. Puedes tener **múltiples notificaciones** visibles al mismo tiempo
4. Son **dismissible** - el usuario puede cerrarlas tocando la X
5. Son **animadas** automáticamente

## 🐛 Troubleshooting

### Las notificaciones no se muestran

1. Verifica que `NotificationProvider` esté en `AppContext.js`
2. Verifica que `NotificationBar` esté en `AuthWrapper.js`
3. Verifica que estés usando el hook correctamente: `useNotification()`

### Las notificaciones se muestran detrás de otros elementos

Asegúrate de que `NotificationBar` esté renderizado **después** de tu contenido principal en `AuthWrapper.js`.

## 📄 Ejemplo Real: Login implementado

Ya actualizamos tu `useLogin.js` hook para usar el sistema de notificaciones:

```javascript
import { useNotification } from "../contexts/NotificationContext";

export const useLogin = () => {
  const { showError, showSuccess, showWarning, showInfo } = useNotification();

  const handleLogin = async () => {
    if (!email || !password) {
      showWarning("Por favor completa todos los campos");
      return;
    }

    try {
      // ... código de login
      showSuccess("¡Inicio de sesión exitoso!");
    } catch (error) {
      showError(error.message || "Error al iniciar sesión");
    }
  };

  const handleRegister = () => {
    showInfo("La funcionalidad de registro estará disponible pronto");
  };

  // ... resto del código
};
```

---

**¡Listo!** 🎉 Ahora puedes usar notificaciones desde cualquier parte de tu aplicación.
