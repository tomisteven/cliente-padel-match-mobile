import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/global';
import { PlayerCard } from '../../components/generic';

export default function JugadoresClub({ route, navigation }) {
    const { club } = route.params;
    const [searchQuery, setSearchQuery] = useState('');

    const jugadores = club.jugadoresAfiliados || [];

    // Filtrar jugadores en tiempo real
    const filteredJugadores = useMemo(() => {
        if (!searchQuery.trim()) {
            return jugadores;
        }

        const query = searchQuery.toLowerCase().trim();
        return jugadores.filter((jugador) => {
            const nombreMatch = jugador.nombre?.toLowerCase().includes(query);
            const categoriaMatch = jugador.categoria?.toString().includes(query);
            const localidadMatch = jugador.localidad?.toLowerCase().includes(query);
            return nombreMatch || categoriaMatch || localidadMatch;
        });
    }, [searchQuery, jugadores]);

    // Calcular estadísticas por categoría
    const categoriasStats = useMemo(() => {
        const stats = {};
        jugadores.forEach(jugador => {
            const cat = jugador.categoria || 'No especificado';
            stats[cat] = (stats[cat] || 0) + 1;
        });
        return stats;
    }, [jugadores]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={26} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {club.nombreClub}
                    </Text>
                    <Text style={styles.headerSubtitle}>Jugadores Afiliados</Text>
                </View>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{jugadores.length}</Text>
                </View>
            </View>

            {/* Estadísticas Rápidas */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Ionicons name="people" size={18} color={colors.primary} />
                    <Text style={styles.statValue}>{jugadores.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="trophy" size={18} color={colors.orange} />
                    <Text style={styles.statValue}>
                        {Object.keys(categoriasStats).length}
                    </Text>
                    <Text style={styles.statLabel}>Niveles</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="star" size={18} color={colors.accent} />
                    <Text style={styles.statValue}>
                        {Math.max(...Object.keys(categoriasStats).map(Number).filter(n => !isNaN(n)), 0)}
                    </Text>
                    <Text style={styles.statLabel}>Nivel Max</Text>
                </View>
            </View>

            {/* Barra de Búsqueda */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.gray} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por nombre, nivel, ubicación..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.gray} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Resultados de Búsqueda */}
            {searchQuery.trim().length > 0 && (
                <View style={styles.searchResults}>
                    <Text style={styles.searchResultsText}>
                        {filteredJugadores.length}{' '}
                        {filteredJugadores.length === 1 ? 'resultado' : 'resultados'} para
                        "{searchQuery}"
                    </Text>
                </View>
            )}

            {/* Lista de Jugadores */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filteredJugadores.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons
                                name={searchQuery ? 'search-outline' : 'people-outline'}
                                size={80}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {searchQuery
                                ? 'No se encontraron jugadores'
                                : 'No hay jugadores afiliados'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? `No hay jugadores que coincidan con "${searchQuery}".\nIntenta con otra búsqueda.`
                                : 'Este club aún no tiene jugadores afiliados.'}
                        </Text>
                        {searchQuery && (
                            <TouchableOpacity
                                style={styles.clearSearchButton}
                                onPress={() => setSearchQuery('')}
                            >
                                <Text style={styles.clearSearchButtonText}>
                                    Limpiar búsqueda
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <>
                        {/* Distribución por Niveles */}
                        {Object.keys(categoriasStats).length > 0 && !searchQuery && (
                            <View style={styles.levelDistribution}>
                                <Text style={styles.levelTitle}>Distribución por Niveles</Text>
                                <View style={styles.levelGrid}>
                                    {Object.entries(categoriasStats)
                                        .sort((a, b) => {
                                            const numA = parseInt(a[0]);
                                            const numB = parseInt(b[0]);
                                            if (isNaN(numA)) return 1;
                                            if (isNaN(numB)) return -1;
                                            return numA - numB;
                                        })
                                        .map(([nivel, count]) => (
                                            <View key={nivel} style={styles.levelCard}>
                                                <View style={styles.levelIcon}>
                                                    <Ionicons name="trophy" size={16} color={colors.orange} />
                                                </View>
                                                <Text style={styles.levelNumber}>{count}</Text>
                                                <Text style={styles.levelLabel}>Nivel {nivel}</Text>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        )}

                        {/* Lista de Jugadores */}
                        <View style={styles.playersList}>
                            {filteredJugadores.map((jugador, index) => (
                                <PlayerCard
                                    key={jugador._id || jugador.id || index}
                                    player={jugador}
                                    onPress={(player) =>
                                        navigation.navigate('PlayerProfile', { player })
                                    }
                                    onActionPress={(player) =>
                                        navigation.navigate('PlayerProfile', { player })
                                    }
                                    actionIcon="eye"
                                />
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
    },
    header: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        elevation: 2,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
    },
    headerTitle: {
        ...typography.title,
        fontSize: 18,
        color: colors.white,
        fontWeight: '700',
    },
    headerSubtitle: {
        ...typography.caption,
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    headerBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBadgeText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: 16,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        ...typography.title,
        fontSize: 22,
        fontWeight: '700',
        color: colors.dark,
    },
    statLabel: {
        ...typography.caption,
        fontSize: 11,
        color: colors.gray,
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.light,
        marginHorizontal: spacing.sm,
    },

    // Search Section
    searchSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 12,
        gap: spacing.sm,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.dark,
        paddingVertical: spacing.xs,
    },
    searchResults: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    searchResultsText: {
        ...typography.caption,
        fontSize: 13,
        color: colors.gray,
        fontStyle: 'italic',
    },

    // Content
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },

    // Level Distribution
    levelDistribution: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    levelTitle: {
        ...typography.subtitle,
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: spacing.md,
    },
    levelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    levelCard: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    levelIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    levelNumber: {
        ...typography.title,
        fontSize: 20,
        fontWeight: '700',
        color: colors.dark,
    },
    levelLabel: {
        ...typography.caption,
        fontSize: 11,
        color: colors.gray,
    },

    // Players List
    playersList: {
        paddingHorizontal: spacing.md,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 3,
        paddingHorizontal: spacing.lg,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8F5E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        ...typography.title,
        fontSize: 22,
        color: colors.dark,
        fontWeight: '600',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.gray,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.lg,
    },
    clearSearchButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
    },
    clearSearchButtonText: {
        ...typography.body,
        color: colors.white,
        fontWeight: '600',
    },
});
