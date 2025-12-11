import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../styles/global';

/**
 * Componente genérico reutilizable para mostrar un jugador
 * @param {Object} player - Objeto del jugador con sus datos
 * @param {Function} onPress - Función que se ejecuta al presionar la card
 * @param {Function} onActionPress - Función que se ejecuta al presionar el botón de acción (opcional)
 * @param {string} actionIcon - Nombre del ícono para el botón de acción (default: 'eye')
 */
export default function PlayerCard({ player, onPress, onActionPress, actionIcon = 'eye' }) {
    // Función para obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Función para obtener color según categoría
    const getCategoryColor = (categoria) => {
        const colors_category = {
            1: '#D32F2F', // Pro - Rojo Intenso
            2: '#E64A19', // Semi Pro - Naranja Rojizo
            3: '#F57C00', // Inicio AJPP - Naranja
            4: '#FFA000', // Muy Regular - Ambar
            5: '#1976D2', // Avanzado - Azul
            6: '#7B1FA2', // Int / Adv - Violeta
            7: '#512DA8', // Intermedio - Indigo Profundo
            8: '#388E3C', // Principiante - Verde
        };
        return colors_category[categoria] || colors.primary;
    };

    const categoryColor = getCategoryColor(player.categoria);

    return (
        <TouchableOpacity
            style={[styles.playerCard, { borderLeftColor: categoryColor }]}
            onPress={() => onPress && onPress(player)}
            activeOpacity={0.7}
        >
            {/* Avatar con Gradiente */}
            <LinearGradient
                colors={[categoryColor, '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarContainer}
            >
                <View style={[styles.avatarInner, { backgroundColor: categoryColor }]}>
                    <Text style={styles.avatarText}>{getInitials(player.nombre)}</Text>
                </View>
            </LinearGradient>

            {/* Información del Jugador */}
            <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.nombre || 'Sin nombre'}</Text>

                <View style={styles.playerMetadata}>
                    {/* Categoría Badge */}
                    <View
                        style={[
                            styles.categoryBadge,
                            { backgroundColor: `${categoryColor}15`, borderColor: `${categoryColor}30`, borderWidth: 1 }
                        ]}
                    >
                        <Ionicons
                            name="trophy"
                            size={12}
                            color={categoryColor}
                        />
                        <Text
                            style={[
                                styles.categoryText,
                                { color: categoryColor },
                            ]}
                        >
                            Nivel {player.categoria}
                        </Text>
                    </View>

                    {/* Ubicación si existe */}
                    {player.localidad && (
                        <View style={styles.locationBadge}>
                            <Ionicons name="location-outline" size={13} color={colors.gray} />
                            <Text style={styles.locationText}>{player.localidad}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Botón de Acción */}
            {onActionPress && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onActionPress(player);
                    }}
                >
                    <Ionicons name={actionIcon} size={22} color={colors.primary} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    playerCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderLeftWidth: 5,
    },
    avatarContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        padding: 2, // Border effect
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarInner: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 17,
        color: colors.dark,
        fontWeight: '700',
        marginBottom: 4,
    },
    playerMetadata: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        gap: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    locationText: {
        fontSize: 12,
        color: colors.gray,
        fontWeight: '500',
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
        borderWidth: 1,
        borderColor: '#EEF0F4',
    },
});
