import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNotification } from '../contexts/NotificationContext';
import { colors, typography, spacing } from '../styles/global';
import { Ionicons } from '@expo/vector-icons';

/**
 * Componente de demostración del sistema de notificaciones
 * Puedes agregar este componente temporalmente a cualquier pantalla para probar
 * las notificaciones o dejarlo como referencia.
 */
export default function NotificationDemo() {
    const {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        addNotification,
        clearAllNotifications,
    } = useNotification();

    const demos = [
        {
            title: 'Éxito',
            subtitle: 'Notificación verde de éxito',
            icon: 'checkmark-circle',
            color: '#10b981',
            action: () => showSuccess('¡Operación completada exitosamente!'),
        },
        {
            title: 'Error',
            subtitle: 'Notificación roja de error',
            icon: 'close-circle',
            color: '#ef4444',
            action: () => showError('Algo salió mal. Por favor intenta nuevamente.'),
        },
        {
            title: 'Advertencia',
            subtitle: 'Notificación naranja de advertencia',
            icon: 'warning',
            color: '#f59e0b',
            action: () => showWarning('Ten cuidado con esta acción'),
        },
        {
            title: 'Información',
            subtitle: 'Notificación azul informativa',
            icon: 'information-circle',
            color: '#3b82f6',
            action: () => showInfo('Tienes 3 mensajes nuevos'),
        },
        {
            title: 'Duración Personalizada',
            subtitle: 'Notificación que dura 6 segundos',
            icon: 'time',
            color: '#8b5cf6',
            action: () => showSuccess('Este mensaje durará 6 segundos', 6000),
        },
        {
            title: 'Múltiples Notificaciones',
            subtitle: 'Mostrar varias a la vez',
            icon: 'layers',
            color: '#ec4899',
            action: () => {
                showSuccess('Primera notificación');
                setTimeout(() => showInfo('Segunda notificación'), 200);
                setTimeout(() => showWarning('Tercera notificación'), 400);
            },
        },
        {
            title: 'Notificación Persistente',
            subtitle: 'No se cierra automáticamente',
            icon: 'infinite',
            color: '#6366f1',
            action: () =>
                addNotification(
                    'Esta notificación permanecerá hasta que la cierres manualmente',
                    'info',
                    0
                ),
        },
        {
            title: 'Limpiar Todo',
            subtitle: 'Remover todas las notificaciones',
            icon: 'trash',
            color: '#64748b',
            action: () => clearAllNotifications(),
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="notifications" size={40} color={colors.primary} />
                <Text style={styles.title}>Sistema de Notificaciones</Text>
                <Text style={styles.description}>
                    Toca cualquier botón para ver diferentes tipos de notificaciones
                </Text>
            </View>

            <View style={styles.grid}>
                {demos.map((demo, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.card, { borderLeftColor: demo.color }]}
                        onPress={demo.action}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: demo.color + '20' }]}>
                            <Ionicons name={demo.icon} size={28} color={demo.color} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{demo.title}</Text>
                            <Text style={styles.cardSubtitle}>{demo.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.gray} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    💡 Tip: Las notificaciones aparecen en la parte superior de la pantalla
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
    header: {
        padding: spacing.xl,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        ...typography.h1,
        color: colors.dark,
        marginTop: spacing.md,
        fontSize: 24,
    },
    description: {
        ...typography.body,
        color: colors.gray,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    grid: {
        padding: spacing.md,
        gap: spacing.md,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: spacing.md,
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        ...typography.h3,
        color: colors.dark,
        fontSize: 16,
        marginBottom: 4,
    },
    cardSubtitle: {
        ...typography.small,
        color: colors.gray,
    },
    footer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        ...typography.small,
        color: colors.gray,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
