import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../styles/global';

/**
 * Componente genérico reutilizable para mostrar un partido
 * Rediseñado con estética "Vibrant Celeste"
 */
export default function PartidoCard({ partido, index = 0, onPress, onJoin, onLeave, onDetailsPress, isSelected = false, estaAfiliado, onRefresh }) {

    // --- LOGIC HELPERS ---

    const getPartidoStatus = () => {
        const jugadoresActuales = partido.jugadores?.length || 0;
        const jugadoresMaximos = partido.jugadoresMaximos || 4;

        if (jugadoresActuales >= jugadoresMaximos) {
            return { text: 'Completo', color: '#B8860B', icon: 'trophy', bg: '#FFF8DC' };
        } else if (jugadoresActuales >= jugadoresMaximos - 1) {
            return { text: '¡Último lugar!', color: '#FF9800', icon: 'flash', bg: '#FFF3E0' };
        } else {
            return { text: 'Disponible', color: colors.success || '#10B981', icon: 'checkmark-circle', bg: '#E6FFFA' };
        }
    };

    const formatFecha = (fechaStr) => {
        if (!fechaStr) return 'Fecha no disponible';
        const fecha = new Date(fechaStr);
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${dias[fecha.getDay()]}, ${fecha.getDate()} ${meses[fecha.getMonth()]}`;
    };

    const toggleJoin = () => {
        if (!estaAfiliado) {
            onJoin(partido._id);
        } else {
            onLeave(partido._id);
        }
    };

    const handleOpenMap = () => {
        if (!partido.coordenadas) return;
        let lat, lng;
        if (typeof partido.coordenadas === 'object') {
            lat = partido.coordenadas.lat;
            lng = partido.coordenadas.lng;
        } else if (typeof partido.coordenadas === 'string' && partido.coordenadas.includes(',')) {
            [lat, lng] = partido.coordenadas.split(',');
        } else {
            lat = partido.coordenadas;
            lng = '';
        }
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = lat && lng ? `${lat},${lng}` : partido.coordenadas;
        const label = partido.cancha || 'Ubicación del partido';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(webUrl);
            }
        }).catch(() => Linking.openURL(webUrl));
    };

    // --- CONSTANTS ---
    const status = getPartidoStatus();
    const jugadoresActuales = partido.jugadores?.length || 0;
    const jugadoresMaximos = partido.jugadoresMaximos || 4;
    const lugaresDisponibles = jugadoresMaximos - jugadoresActuales;
    const isCompleto = lugaresDisponibles === 0;

    // Gradient Colors based on status
    const headerGradient = isCompleto
        ? ['#ffa81cd0', '#FFA500'] // Gold for full
        : ['#36d444ff', '#003ca5ff']; // Celeste default

    const displayNombre = partido.nombreClub
        ? `${partido.nombreClub}`
        : `Partido #${index + 1}`;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.cardContainer, isSelected && styles.cardSelected]}
        >
            {/* --- HEADER CON GRADIENTE --- */}
            <LinearGradient
                colors={headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardHeader}
            >
                <View style={styles.headerContent}>
                    <View style={styles.headerTopRow}>
                        <Text style={styles.clubName} numberOfLines={1}>{displayNombre}</Text>
                        {isCompleto && <Ionicons name="trophy" size={20} color="white" />}
                    </View>

                    <View style={styles.headerBottomRow}>
                        <View style={styles.badgeContainer}>
                            <Ionicons name="tennisball" size={14} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.badgeText}>{partido.cancha || 'Sin Definir'}</Text>
                        </View>
                        {partido.categoria && (
                            <View style={styles.badgeContainer}>
                                <Ionicons name="star" size={14} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.badgeText}>Cat. {partido.categoria}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </LinearGradient>

            {/* --- BODY --- */}
            <View style={styles.cardBody}>
                {/* Info Row: Date, Time, Status */}
                <View style={styles.infoRow}>
                    <View style={styles.dateTimeContainer}>
                        <View style={styles.dateTimeItem}>
                            <Ionicons name="calendar-outline" size={18} color={colors.gray} />
                            <Text style={styles.dateTimeText}>{formatFecha(partido.fecha)}</Text>
                        </View>
                        <View style={styles.dateTimeItem}>
                            <Ionicons name="time-outline" size={18} color={colors.gray} />
                            <Text style={styles.dateTimeText}>{partido.hora}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                        <Ionicons name={status.icon} size={14} color={status.color} />
                        <Text style={[styles.statusPillText, { color: status.color }]}>{status.text}</Text>
                    </View>
                </View>

                {/* Separator */}
                <View style={styles.separator} />

                {/* Players Section */}
                <View style={styles.playersSection}>
                    <View style={styles.playersHeader}>
                        <Text style={styles.playersLabel}>Jugadores</Text>
                        <Text style={styles.playersCount}>
                            {jugadoresActuales}/{jugadoresMaximos}
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={isCompleto ? ['#FFD700', '#FFA500'] : ['#2193b0', '#6dd5ed']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                height: '100%',
                                width: `${(jugadoresActuales / jugadoresMaximos) * 100}%`,
                                borderRadius: 4
                            }}
                        />
                    </View>

                    {/* Player Avatars (Small preview) */}
                    <View style={styles.avatarList}>
                        {partido.jugadores?.slice(0, 4).map((p, i) => (
                            <View key={i} style={[styles.miniAvatar, { left: i * -10, zIndex: 4 - i }]}>
                                <Text style={styles.miniAvatarText}>{p.nombre ? p.nombre.charAt(0).toUpperCase() + p.nombre.charAt(1).toLowerCase() : '?'}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* --- ACTION BUTTONS --- */}
                {!!onJoin && (
                    <View style={styles.actionButtonsContainer}>
                        {/* JOIN/LEAVE BUTTON */}
                        <TouchableOpacity
                            style={[
                                styles.mainActionButton,
                                isCompleto && !estaAfiliado ? styles.disabledButton : null,
                                estaAfiliado ? styles.leaveButton : null
                            ]}
                            onPress={() => !isCompleto || estaAfiliado ? toggleJoin() : null}
                            disabled={isCompleto && !estaAfiliado}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    estaAfiliado ? ['#ef4444', '#dc2626'] :
                                        isCompleto ? ['#e5e7eb', '#d1d5db'] :
                                            ['#2193b0', '#6dd5ed']
                                }
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Ionicons
                                    name={estaAfiliado ? "log-out-outline" : "add-circle-outline"}
                                    size={20}
                                    color={isCompleto && !estaAfiliado ? colors.gray : "white"}
                                />
                                <Text style={[
                                    styles.buttonText,
                                    isCompleto && !estaAfiliado ? { color: colors.gray } : { color: 'white' }
                                ]}>
                                    {estaAfiliado ? 'Salir' : isCompleto ? 'Completo' : 'Unirse'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* DETAILS BUTTON */}
                        {onDetailsPress && (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => onDetailsPress(partido)}
                            >
                                <View style={styles.iconButtonInner}>
                                    <Ionicons name="eye-outline" size={22} color={colors.primary} />
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* MAP BUTTON */}
                        {partido.coordenadas && (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={handleOpenMap}
                            >
                                <View style={styles.iconButtonInner}>
                                    <Ionicons name="map-outline" size={22} color={colors.secondary} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    cardSelected: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    // HEADER
    cardHeader: {
        padding: spacing.md,
        paddingBottom: spacing.lg,
    },
    headerContent: {
        gap: 6
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    clubName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2
    },
    headerBottomRow: {
        flexDirection: 'row',
        gap: 10
    },
    badgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600'
    },
    // BODY
    cardBody: {
        padding: spacing.md,
        marginTop: -15,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm
    },
    dateTimeContainer: {
        gap: 6
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    dateTimeText: {
        color: colors.dark,
        fontSize: 14,
        fontWeight: '500'
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4
    },
    statusPillText: {
        fontSize: 12,
        fontWeight: '700'
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: spacing.sm
    },
    // PLAYERS
    playersSection: {
        marginBottom: spacing.md
    },
    playersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    playersLabel: {
        fontSize: 13,
        color: colors.gray,
        fontWeight: '600'
    },
    playersCount: {
        fontSize: 13,
        color: colors.dark,
        fontWeight: '700'
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10
    },
    avatarList: {
        flexDirection: 'row',
        paddingLeft: 5,
        height: 30
    },
    miniAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#ffbf00ff',
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    miniAvatarText: {
        fontSize: 15,
        color: colors.white,
        fontWeight: 'bold'
    },
    // BUTTONS
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: spacing.xs
    },
    mainActionButton: {
        flex: 1,
        borderRadius: 12,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700'
    },
    disabledButton: {
        shadowOpacity: 0,
        elevation: 0
    },
    leaveButton: {
        shadowColor: '#ef4444',
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonInner: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
