import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/global';

/**
 * Componente genérico reutilizable para mostrar un club
 * @param {Object} club - Objeto del club con sus datos
 * @param {Function} onPress - Función que se ejecuta al presionar la card
 * @param {boolean} showDistance - Si se debe mostrar la distancia (requiere ubicacionUsuario)
 * @param {Object} ubicacionUsuario - Objeto con latitude y longitude del usuario
 */
export default function ClubCard({ club, onPress, showDistance = false, ubicacionUsuario }) {
    // Calcular miembros
    const miembros = club.jugadoresAfiliados?.length || 0;
    const partidosActivos = club.partidosActivos?.length || 0;

    // Función para calcular distancia (simplificada)
    const obtenerDistancia = () => {
        if (!showDistance || !ubicacionUsuario || !club.coordenadas?.x || !club.coordenadas?.y) {
            return null;
        }
        // Aquí iría el cálculo real de distancia
        return '2.5 km';
    };

    const distancia = obtenerDistancia();

    return (
        <TouchableOpacity
            style={styles.clubCard}
            onPress={() => onPress && onPress(club)}
            activeOpacity={0.7}
        >
            {/* Icono del club */}
            <View style={styles.clubIconContainer}>
                <Ionicons name="business" size={32} color={colors.primary} />
            </View>

            {/* Información del club */}
            <View style={styles.clubInfo}>
                <Text style={styles.clubName} numberOfLines={1}>
                    {club.nombreClub}
                </Text>

                {/* Ubicación */}
                {(club.localidad || club.ciudad) && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color={colors.gray} />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {club.localidad && club.ciudad
                                ? `${club.localidad}, ${club.ciudad}`
                                : club.localidad || club.ciudad}
                        </Text>
                    </View>
                )}

                {/* Estadísticas */}
                <View style={styles.statsRow}>
                    {/* Miembros */}
                    <View style={styles.statItem}>
                        <Ionicons name="people" size={14} color={colors.primary} />
                        <Text style={styles.statText}>{miembros} miembros</Text>
                    </View>

                    {/* Partidos activos */}
                    <View style={styles.statItem}>
                        <Ionicons name="tennisball" size={14} color={colors.primary} />
                        <Text style={styles.statText}>{partidosActivos} partidos</Text>
                    </View>

                    {/* Distancia si está disponible */}
                    {distancia && (
                        <View style={styles.statItem}>
                            <Ionicons name="navigate" size={14} color={colors.primary} />
                            <Text style={styles.statText}>{distancia}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Flecha de navegación */}
            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={24} color={colors.gray} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    clubCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    clubIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    clubInfo: {
        flex: 1,
    },
    clubName: {
        ...typography.subtitle,
        fontSize: 17,
        color: colors.dark,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: spacing.xs,
    },
    locationText: {
        ...typography.caption,
        fontSize: 13,
        color: colors.gray,
        flex: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flexWrap: 'wrap',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        ...typography.caption,
        fontSize: 12,
        color: colors.dark,
        fontWeight: '500',
    },
    arrowContainer: {
        marginLeft: spacing.sm,
    },
});
