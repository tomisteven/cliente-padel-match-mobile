import React, { createContext, useContext, useReducer, useCallback } from "react";

const NotificationContext = createContext();

const initialState = {
    notifications: [], // Array de notificaciones activas
};

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "ADD_NOTIFICATION":
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case "REMOVE_NOTIFICATION":
            return {
                ...state,
                notifications: state.notifications.filter(
                    (notification) => notification.id !== action.payload
                ),
            };
        case "CLEAR_ALL":
            return {
                ...state,
                notifications: [],
            };
        default:
            return state;
    }
};

export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    // Función para agregar una notificación
    const addNotification = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random(); // ID único para cada notificación

        const notification = {
            id,
            message,
            type, // "success", "error", "warning", "info"
            duration,
        };

        dispatch({ type: "ADD_NOTIFICATION", payload: notification });

        // Auto-remover la notificación después de la duración especificada
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    // Función para remover una notificación específica
    const removeNotification = useCallback((id) => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    }, []);

    // Función para limpiar todas las notificaciones
    const clearAllNotifications = useCallback(() => {
        dispatch({ type: "CLEAR_ALL" });
    }, []);

    // Funciones de utilidad para tipos específicos de notificaciones
    const showSuccess = useCallback((message, duration = 3000) => {
        return addNotification(message, "success", duration);
    }, [addNotification]);

    const showError = useCallback((message, duration = 4000) => {
        return addNotification(message, "error", duration);
    }, [addNotification]);

    const showWarning = useCallback((message, duration = 3500) => {
        return addNotification(message, "warning", duration);
    }, [addNotification]);

    const showInfo = useCallback((message, duration = 3000) => {
        return addNotification(message, "info", duration);
    }, [addNotification]);

    return (
        <NotificationContext.Provider
            value={{
                notifications: state.notifications,
                addNotification,
                removeNotification,
                clearAllNotifications,
                showSuccess,
                showError,
                showWarning,
                showInfo,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
