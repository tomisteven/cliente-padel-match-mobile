import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/global';
import EditMatchModal from './EditMatchModal';
import ChatModal from './ChatModal.js';
import { useMatchDetailLogic } from './hooks/useMatchDetailLogic';
import { styles } from './styles/MatchDetailScreen.styles';

export default function MatchDetailScreen({ route, navigation }) {
    const {
        partido,
        isEditModalVisible,
        setIsEditModalVisible,
        isChatModalVisible,
        setIsChatModalVisible,
        status,
        jugadoresActuales,
        jugadoresMaximos,
        lugaresDisponibles,
        formatFechaCompleta,
        handleJoinMatch,
        handleLeaveMatch,
        handleChatMatch,
        handleShareMatch,
        handleEditMatch,
        handleSendMessage,
        estaAfiliado
    } = useMatchDetailLogic(navigation, route);

    const isAffiliated = estaAfiliado();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.light} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles del Partido</Text>
                <TouchableOpacity
                    style={[styles.editButton, { opacity: isAffiliated ? 1 : 0.5 }]}
                    disabled={!isAffiliated}
                    onPress={handleEditMatch}
                    activeOpacity={0.7}
                >
                    <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.editButton, { opacity: isAffiliated ? 1 : 0.5 }]}
                    onPress={handleChatMatch}
                    disabled={!isAffiliated}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Card Principal */}
                <View style={styles.mainCard}>
                    <View style={styles.iconHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="tennisball" size={40} color={colors.white} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.matchName}>{partido.nombreClub || partido._id}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                                <Ionicons name={status.icon} size={16} color={status.color} />
                                <Text style={[styles.statusText, { color: status.color }]}>
                                    {status.text}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Información Principal */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoCard}>
                            <Ionicons name="calendar" size={24} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Fecha</Text>
                                <Text style={styles.infoValue}>{formatFechaCompleta(partido.fecha)}</Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons name="time" size={24} color={colors.accent} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Hora</Text>
                                <Text style={styles.infoValue}>{partido.hora || 'Por definir'}</Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons name="location" size={24} color={colors.secondary} />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Ubicación</Text>
                                <Text style={styles.infoValue}>{partido.cancha || 'Por definir'}</Text>
                            </View>
                        </View>

                        {partido.nivel && (
                            <View style={styles.infoCard}>
                                <Ionicons name="trophy" size={24} color={colors.purple} />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Nivel</Text>
                                    <Text style={styles.infoValue}>{partido.nivel}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Jugadores Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="people" size={24} color={colors.dark} />
                        <Text style={styles.sectionTitle}>Jugadores</Text>
                    </View>

                    <View style={styles.playersProgress}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${(jugadoresActuales / jugadoresMaximos) * 100}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {jugadoresActuales} / {jugadoresMaximos} jugadores
                        </Text>
                    </View>

                    {partido.jugadores && partido.jugadores.length > 0 ? (
                        <View style={styles.playersList}>
                            {partido.jugadores.map((jugador, idx) => (
                                <View key={idx} style={styles.playerCard}>
                                    <View style={styles.playerAvatar}>
                                        <Ionicons name="person" size={24} color={colors.white} />
                                    </View>
                                    <View style={styles.playerInfo}>
                                        <Text style={styles.playerName}>
                                            {jugador.nombre || `Jugador ${idx + 1}`}
                                        </Text>
                                        {jugador.nivel && (
                                            <Text style={styles.playerLevel}>Nivel: {jugador.nivel}</Text>
                                        )}
                                    </View>
                                    {idx === 0 && (
                                        <View style={styles.organizerBadge}>
                                            <Ionicons name="star" size={14} color={colors.orange} />
                                            <Text style={styles.organizerText}>Organizador</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyPlayers}>
                            <Ionicons name="person-add-outline" size={48} color={colors.gray} />
                            <Text style={styles.emptyText}>Aún no hay jugadores apuntados</Text>
                        </View>
                    )}
                </View>

                {/* Descripción */}
                {partido.descripcion && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text" size={24} color={colors.dark} />
                            <Text style={styles.sectionTitle}>Descripción</Text>
                        </View>
                        <Text style={styles.description}>{partido.descripcion}</Text>
                    </View>
                )}

                {/* Detalles Adicionales */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle" size={24} color={colors.dark} />
                        <Text style={styles.sectionTitle}>Información Adicional</Text>
                    </View>
                    <View style={styles.additionalInfo}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoRowLabel}>Precio:</Text>
                            <Text style={styles.infoRowValue}>
                                {partido.precio ? `$${partido.precio}` : 'Gratuito'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoRowLabel}>Duración:</Text>
                            <Text style={styles.infoRowValue}>
                                {partido.duracion || '90 minutos'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoRowLabel}>Tipo:</Text>
                            <Text style={styles.infoRowValue}>
                                {partido.tipo || 'Competitivo'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Botones de Acción Fijos */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShareMatch}
                    activeOpacity={0.7}
                >
                    <Ionicons name="share-social" size={22} color={colors.primary} />
                </TouchableOpacity>

                {lugaresDisponibles > 0 ? (
                    <TouchableOpacity
                        style={[styles.joinButton, isAffiliated && styles.removeButton]}
                        onPress={isAffiliated ? handleLeaveMatch : handleJoinMatch}

                        activeOpacity={0.8}
                    >
                        <Ionicons name={isAffiliated ? "exit" : "add-circle"} size={22} color={colors.white} />
                        <Text style={styles.joinButtonText}>
                            {isAffiliated ? 'Dejar el partido' : 'Unirse al Partido'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.fullButton}>
                        <Ionicons name="lock-closed" size={22} color={colors.white} />
                        <Text style={styles.fullButtonText}>Partido Completo</Text>
                    </View>
                )}
            </View>

            {/* Modal de Edición */}
            <EditMatchModal
                visible={isEditModalVisible}
                partido={partido}
                onClose={() => setIsEditModalVisible(false)}
            />

            {/* Modal de Chat */}
            <ChatModal
                visible={isChatModalVisible}
                partido={partido}
                onClose={() => setIsChatModalVisible(false)}
                onSendMessage={handleSendMessage}
            />
        </SafeAreaView>
    );
}
