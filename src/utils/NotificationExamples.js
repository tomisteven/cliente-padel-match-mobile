/**
 * GUÍA DE USO DEL SISTEMA DE NOTIFICACIONES GLOBAL
 * 
 * Este archivo muestra ejemplos de cómo usar el sistema de notificaciones
 * desde cualquier parte de tu aplicación móvil.
 */

// ============================================
// 1. IMPORTAR EL HOOK
// ============================================
import { useNotification } from '../contexts/NotificationContext';

// ============================================
// 2. EJEMPLO EN UN COMPONENTE FUNCIONAL
// ============================================
function ExampleComponent() {
    // Obtener las funciones del contexto
    const { showSuccess, showError, showWarning, showInfo, addNotification } = useNotification();

    // Ejemplo 1: Notificación de éxito
    const handleSuccess = () => {
        showSuccess('¡Operación completada exitosamente!');
        // Duración personalizada (4 segundos)
        showSuccess('¡Datos guardados correctamente!', 4000);
    };

    // Ejemplo 2: Notificación de error
    const handleError = () => {
        showError('Error al cargar los datos');
        // Duración personalizada (5 segundos)
        showError('No se pudo conectar con el servidor', 5000);
    };

    // Ejemplo 3: Notificación de advertencia
    const handleWarning = () => {
        showWarning('Algunos campos están incompletos');
        showWarning('Tu sesión expirará en 5 minutos', 6000);
    };

    // Ejemplo 4: Notificación informativa
    const handleInfo = () => {
        showInfo('Tienes 3 mensajes nuevos');
        showInfo('La aplicación se actualizó a la versión 2.0', 4000);
    };

    // Ejemplo 5: Notificación personalizada con tipo específico
    const handleCustom = () => {
        // Parámetros: (mensaje, tipo, duración)
        addNotification('Mensaje personalizado', 'info', 3000);
    };

    return (
        // Tu componente aquí
        <View>
            <Button title="Mostrar éxito" onPress={handleSuccess} />
            <Button title="Mostrar error" onPress={handleError} />
            <Button title="Mostrar advertencia" onPress={handleWarning} />
            <Button title="Mostrar info" onPress={handleInfo} />
        </View>
    );
}

// ============================================
// 3. EJEMPLO EN UN HOOK PERSONALIZADO
// ============================================
function useLogin() {
    const { showSuccess, showError } = useNotification();

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                showSuccess('¡Inicio de sesión exitoso!');
                return true;
            } else {
                showError('Credenciales incorrectas');
                return false;
            }
        } catch (error) {
            showError('Error de conexión. Intenta nuevamente.');
            return false;
        }
    };

    return { login };
}

// ============================================
// 4. EJEMPLO EN UN CONTEXT (DESDE APICONTEXT)
// ============================================
import { useNotification } from './NotificationContext';

export const ApiProvider = ({ children }) => {
    const { showError, showSuccess } = useNotification();

    const loadEstadisticas = async () => {
        try {
            const response = await fetch(`${API_URL}${API_ROUTES.ESTADISTICAS}`);

            if (!response.ok) {
                showError('Error al cargar estadísticas');
                throw new Error('Error loading stats');
            }

            const data = await response.json();
            showSuccess('Estadísticas cargadas correctamente');
            return data;
        } catch (error) {
            showError('No se pudo conectar con el servidor');
            console.error(error);
        }
    };

    // ... resto del código
};

// ============================================
// 5. TIPOS DE NOTIFICACIONES DISPONIBLES
// ============================================
/*
  - showSuccess(mensaje, duración?)  → Verde con ícono de checkmark
  - showError(mensaje, duración?)    → Rojo con ícono de error
  - showWarning(mensaje, duración?)  → Naranja con ícono de advertencia
  - showInfo(mensaje, duración?)     → Azul con ícono de información
  - addNotification(mensaje, tipo, duración?) → Personalizable

  PARÁMETROS:
  - mensaje (string): El texto que se mostrará
  - duración (number, opcional): Milisegundos antes de auto-cerrar (default: 3000)
    * Para success: default 3000ms
    * Para error: default 4000ms
    * Para warning: default 3500ms
    * Para info: default 3000ms
  
  - tipo (string): 'success' | 'error' | 'warning' | 'info'
*/

// ============================================
// 6. MÉTODOS ADICIONALES
// ============================================
function AdvancedExamples() {
    const { removeNotification, clearAllNotifications } = useNotification();

    // Remover una notificación específica (usando el ID retornado)
    const showAndRemove = () => {
        const id = showInfo('Este mensaje se eliminará en 1 segundo');

        setTimeout(() => {
            removeNotification(id);
        }, 1000);
    };

    // Limpiar todas las notificaciones
    const clearAll = () => {
        clearAllNotifications();
    };

    return (
        <View>
            <Button title="Mostrar y remover" onPress={showAndRemove} />
            <Button title="Limpiar todas" onPress={clearAll} />
        </View>
    );
}

// ============================================
// 7. NOTIFICACIÓN QUE NO SE AUTO-CIERRA
// ============================================
function PersistentNotification() {
    const { addNotification } = useNotification();

    const showPersistent = () => {
        // Duración = 0 significa que no se cerrará automáticamente
        addNotification('Esta notificación permanecerá hasta que la cierres', 'info', 0);
    };

    return (
        <Button title="Mostrar persistente" onPress={showPersistent} />
    );
}

export default ExampleComponent;
