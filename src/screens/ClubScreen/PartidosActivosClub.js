import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/global';
import { PartidoCard } from '../../components/generic';

export default function PartidosActivosClub({ route, navigation }) {
    const { club } = route.params;
    const [selectedPartido, setSelectedPartido] = useState(null);

    const partidosActivos = club.partidosActivos || [];

    // Función para unirse a un partido
    const handleJoinPartido = (partidoId) => {
        Alert.alert(
            'Confirmar unirse',
            '¿Deseas unirte a este partido?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Unirse',
                    onPress: () => {
                        // Aquí iría la lógica para unirse al partido
                        Alert.alert('Éxito', 'Te has unido al partido correctamente');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Partidos Activos</Text>
                    <Text style={styles.headerSubtitle}>{club.nombreClub}</Text>
                </View>
                <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{partidosActivos.length}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {partidosActivos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="tennisball-outline" size={80} color={colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>No hay partidos activos</Text>
                        <Text style={styles.emptyText}>
                            Actualmente no hay partidos disponibles en este club.{'\n'}
                            Vuelve pronto para encontrar nuevos partidos.
                        </Text>
                    </View>
                ) : (
                    partidosActivos.map((partido, index) => (
                        <PartidoCard
                            key={partido._id || index}
                            partido={partido}
                            index={index}
                            onPress={(partido) => setSelectedPartido(partido._id)}
                            onJoin={handleJoinPartido}
                            isSelected={selectedPartido === partido._id}
                        />
                    ))
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
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        ...typography.subtitle,
        color: colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    headerSubtitle: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
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
    },
    emptyText: {
        ...typography.body,
        color: colors.gray,
        textAlign: 'center',
        lineHeight: 22,
    },
    partidoCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        marginBottom: spacing.md,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    partidoCardSelected: {
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        shadowOpacity: 0.15,
        elevation: 6,
    },
    partidoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    partidoIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    partidoInfo: {
        flex: 1,
    },
    partidoNombre: {
        ...typography.subtitle,
        fontSize: 18,
        color: colors.dark,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 4,
    },
    statusText: {
        ...typography.caption,
        fontSize: 12,
        fontWeight: '600',
    },
    partidoDetails: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    detailText: {
        ...typography.body,
        fontSize: 14,
        color: colors.dark,
    },
    jugadoresSection: {
        marginBottom: spacing.md,
    },
    jugadoresTitulo: {
        ...typography.body,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: spacing.sm,
    },
    jugadoresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    jugadoresProgress: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    jugadoresProgressBar: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    jugadoresCount: {
        ...typography.caption,
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
        minWidth: 40,
        textAlign: 'right',
    },
    jugadoresList: {
        gap: spacing.xs,
    },
    jugadorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    jugadorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jugadorNombre: {
        ...typography.caption,
        fontSize: 13,
        color: colors.dark,
    },
    joinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 12,
        gap: spacing.sm,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    joinButtonText: {
        ...typography.body,
        color: colors.white,
        fontWeight: '600',
        fontSize: 15,
    },
    fullButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f3f4',
        paddingVertical: spacing.md,
        borderRadius: 12,
        gap: spacing.sm,
    },
    fullButtonText: {
        ...typography.body,
        color: colors.gray,
        fontWeight: '600',
        fontSize: 15,
    },
    nivelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: spacing.sm,
        paddingVertical: spacing.xs,
    },
    nivelText: {
        ...typography.caption,
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
});
