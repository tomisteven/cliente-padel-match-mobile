import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,

    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/global';

import { usePlayers } from '../../contexts/PlayersContext';
import { useEffect, useState } from 'react';

export default function PlayerProfileScreen({ route, navigation }) {
    const { player } = route?.params || {};
    const { getPlayerById } = usePlayers();
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (player?._id) {
            console.log("cargando desde PlayerProfileScreen");
            setLoading(true);
            getPlayerById(player._id).then((data) => {
                setPlayerData(data.jugadores);
                console.log("playerData", data.jugadores);
                setLoading(false);
            }).catch(err => {
                console.error("Error loading player:", err);
                setLoading(false);
            });
        }
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.loadingContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { marginTop: 10 }]}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!player) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={64} color={colors.gray} />
                    <Text style={styles.errorText}>No se encontró información del jugador</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Obtener las iniciales del nombre para el avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "No disponible";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Obtener nivel basado en categoría
    const getCategoryLevel = (category) => {
        const levels = {
            8: "Principiante",
            7: "Intermedio",
            6: "Int / Avanzado", // Shortened
            5: "Avanzado",
            4: "Muy Regular", // Shortened
            3: "Inicio AJPP",
            2: "Semi Pro",
            1: "Profesional",
        };
        return levels[category] || `Nivel ${category}`;
    };

    // Use playerData if available, otherwise fallback to route player
    const displayPlayer = playerData || player;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Fondo Gradiente Sutil */}
            <LinearGradient
                colors={['#F0F4FF', '#FFFFFF', '#F0F4FF']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Hero Gradient Header */}
            <LinearGradient
                colors={['#2193b0', '#6dd5ed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Perfil</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Content Overlap */}
                <View style={styles.heroSpacer} />

                {/* Avatar & Main Info Card */}
                <View style={styles.mainInfoCard}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[colors.primaryLight, colors.primary]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>{getInitials(displayPlayer.nombre)}</Text>
                        </LinearGradient>
                        <View style={styles.onlineBadge} />
                    </View>

                    <Text style={styles.playerName}>{displayPlayer.nombre || 'Sin nombre'}</Text>
                    <View style={styles.roleBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.white} />
                        <Text style={styles.roleText}>{displayPlayer.rol || "Jugador"}</Text>
                    </View>
                    <Text style={styles.playerEmail}>{displayPlayer.email}</Text>
                </View>

                {/* Stats Grid - Colorful */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
                        <View style={[styles.statIconBadge, { backgroundColor: '#BBDEFB' }]}>
                            <Ionicons name="tennisball" size={20} color="#1976D2" />
                        </View>
                        <Text style={[styles.statValue, { color: '#1976D2' }]}>
                            {displayPlayer.partidosActivos?.length || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: '#1976D2' }]}>Partidos</Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: '#F3E5F5' }]}>
                        <View style={[styles.statIconBadge, { backgroundColor: '#E1BEE7' }]}>
                            <Ionicons name="business" size={20} color="#7B1FA2" />
                        </View>
                        <Text style={[styles.statValue, { color: '#7B1FA2' }]}>
                            {displayPlayer.clubesAfiliados?.length || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: '#7B1FA2' }]}>Clubes</Text>
                    </View>

                    <View style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}>
                        <View style={[styles.statIconBadge, { backgroundColor: '#FFE0B2' }]}>
                            <Ionicons name="star" size={20} color="#F57C00" />
                        </View>
                        <Text style={[styles.statValue, { color: '#F57C00' }]}>
                            {displayPlayer.calificaciones?.length || 0}
                        </Text>
                        <Text style={[styles.statLabel, { color: '#F57C00' }]}>Reseñas</Text>
                    </View>
                </View>

                {/* Info & Details Container */}
                <View style={styles.detailsContainer}>

                    {/* Level Ribbon */}
                    <LinearGradient
                        colors={[colors.accent, '#FF9800']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.levelRibbon}
                    >
                        <View style={styles.levelContent}>
                            <View>
                                <Text style={styles.levelLabel}>Nivel de Juego</Text>
                                <Text style={styles.levelValue}>{getCategoryLevel(displayPlayer.categoria)}</Text>
                            </View>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelNumber}>{displayPlayer.categoria}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Personal Info */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Información Personal</Text>
                        <View style={styles.card}>
                            <View style={styles.infoRow}>
                                <View style={styles.iconCircle}>
                                    <Ionicons name="call" size={18} color={colors.primary} />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Celular</Text>
                                    <Text style={styles.infoValue}>{displayPlayer.celular || "No especificado"}</Text>
                                </View>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <View style={[styles.iconCircle, { backgroundColor: '#E8F5E8' }]}>
                                    <Ionicons name="location" size={18} color={colors.secondary} />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Ubicación</Text>
                                    <Text style={styles.infoValue}>
                                        {displayPlayer.localidad && displayPlayer.provincia
                                            ? `${displayPlayer.localidad}, ${displayPlayer.provincia}`
                                            : "Ubicación no especificada"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <View style={[styles.iconCircle, { backgroundColor: '#FDEDEC' }]}>
                                    <Ionicons name="heart" size={18} color={colors.red} />
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Club Favorito</Text>
                                    <Text style={styles.infoValue}>{displayPlayer.clubFavorito || "No especificado"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>



                    {/* Clubes Afiliados Chips */}
                    {displayPlayer.clubesAfiliados && displayPlayer.clubesAfiliados.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Clubes Afiliados</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
                                {displayPlayer.clubesAfiliados.map((club, index) => (
                                    <View key={club._id || index} style={styles.clubChip}>
                                        <View style={styles.clubChipIcon}>
                                            <Ionicons name="business" size={14} color={colors.white} />
                                        </View>
                                        <Text style={styles.clubChipText}>{club.nombreClub || "Club"}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Calificaciones */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Últimas Reseñas</Text>
                        {displayPlayer.calificaciones && displayPlayer.calificaciones.length > 0 ? (
                            <View style={styles.card}>
                                {displayPlayer.calificaciones.slice(0, 3).map((calif, index) => (
                                    <View key={index} style={styles.ratingItem}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Ionicons
                                                        key={i}
                                                        name={i < calif.calificacion ? "star" : "star-outline"}
                                                        size={14}
                                                        color="#FFC107"
                                                    />
                                                ))}
                                            </View>
                                            <Text style={styles.ratingDate}>Hace un tiempo</Text>
                                        </View>
                                        {calif.comentario && <Text style={styles.ratingText}>"{calif.comentario}"</Text>}
                                        {index < Math.min(displayPlayer.calificaciones.length, 3) - 1 && <View style={styles.separator} />}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={{ color: colors.gray, fontStyle: 'italic' }}>Sin reseñas aún.</Text>
                        )}
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',

    },
    backButton: {

        padding: 10,
        borderRadius: 10,
        zIndex: 999,
    },
    headerGradient: {
        height: 70,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        zIndex: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,

    },
    headerTitle: {
        fontSize: 18,
        color: colors.white,
        fontWeight: '700',
    },
    heroSpacer: {
        height: 100, // Push content down so it overflows header visually
    },
    scrollView: {
        flex: 1,
        marginTop: -100, // Overlap header
    },
    scrollContent: {
        paddingBottom: 40,
    },
    mainInfoCard: {
        backgroundColor: colors.white,
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginTop: -60, // Pull avatar up
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.white,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.white,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: colors.white,
    },
    playerName: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.dark,
        marginBottom: 4,
        textAlign: 'center',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
        marginBottom: 8,
    },
    roleText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    playerEmail: {
        fontSize: 14,
        color: colors.gray,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    statBox: {
        flex: 1,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIconBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    detailsContainer: {
        paddingHorizontal: 20,
    },
    levelRibbon: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    levelContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    levelLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    levelValue: {
        color: colors.white,
        fontSize: 22,
        fontWeight: '800',
    },
    levelBadge: {
        backgroundColor: colors.white,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.accent,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F1F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: colors.dark,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    clubChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    clubChipIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    clubChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
    },
    ratingItem: {
        marginVertical: 4,
    },
    ratingDate: {
        fontSize: 10,
        color: colors.gray,
    },
    ratingText: {
        marginTop: 6,
        color: colors.dark,
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 10,
        color: colors.gray,
    },
});

