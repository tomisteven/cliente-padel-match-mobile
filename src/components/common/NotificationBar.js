import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../../contexts/NotificationContext";

const { width } = Dimensions.get("window");

const NotificationItem = ({ notification, onRemove }) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación de entrada
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 8,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleRemove = () => {
        // Animación de salida
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onRemove(notification.id);
        });
    };

    // Configuración de colores e iconos según el tipo
    const getNotificationConfig = (type) => {
        switch (type) {
            case "success":
                return {
                    backgroundColor: "#f6b92acf",
                    icon: "checkmark-circle",
                    borderColor: "#008f62ff",
                };
            case "error":
                return {
                    backgroundColor: "#ef4444",
                    icon: "close-circle",
                    borderColor: "#dc2626",
                };
            case "warning":
                return {
                    backgroundColor: "#e0d500ff",
                    icon: "warning",
                    borderColor: "#d97706",
                };
            case "info":
            default:
                return {
                    backgroundColor: "#3b82f6",
                    icon: "information-circle",
                    borderColor: "#2563eb",
                };
        }
    };

    const config = getNotificationConfig(notification.type);

    return (
        <Animated.View
            style={[
                styles.notificationContainer,
                {
                    backgroundColor: config.backgroundColor,
                    borderLeftColor: config.borderColor,
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.contentContainer}>
                <Ionicons
                    name={config.icon}
                    size={24}
                    color="#fff"
                    style={styles.icon}
                />
                <Text style={styles.message} numberOfLines={3}>
                    {notification.message}
                </Text>
                <TouchableOpacity
                    onPress={handleRemove}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const NotificationBar = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <View style={styles.container}>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        gap: 10,
        zIndex: 9999,
        elevation: 9999,
    },
    notificationContainer: {
        minHeight: 60,
        borderRadius: 12,
        borderLeftWidth: 4,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
});

export default NotificationBar;
