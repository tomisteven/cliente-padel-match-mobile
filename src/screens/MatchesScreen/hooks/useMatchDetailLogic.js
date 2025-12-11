import { useState } from 'react';
import { Alert } from 'react-native';
import { useNotification } from '../../../contexts/NotificationContext';
import { useMatches } from '../../../contexts/MatchesContext';
import { useUser } from '../../../contexts/UserContext';
import { colors } from '../../../styles/global';

export const useMatchDetailLogic = (navigation, route, onRefresh) => {
    const { partido: initialPartido } = route.params;
    const { matches, joinMatch, leaveMatch } = useMatches();
    const { showSuccess, showError, showInfo } = useNotification();
    const { user } = useUser();

    // Usar el partido del contexto si existe (para tener datos actualizados), si no usar el de params
    const partido = matches.find(m => m._id === initialPartido._id) || initialPartido;

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);

    // ============================================================================
    // HELPERS
    // ============================================================================
    const formatFechaCompleta = (fechaStr) => {
        if (!fechaStr) return 'Fecha no disponible';
        const fecha = new Date(fechaStr);
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
    };

    const getPartidoStatus = () => {
        const jugadoresActuales = partido.jugadores?.length || 0;
        const jugadoresMaximos = partido.jugadoresMaximos || 4;

        if (jugadoresActuales >= jugadoresMaximos) {
            return { text: 'Partido Completo', color: colors.gray, icon: 'checkmark-circle', bgColor: '#e0e0e0' };
        } else if (jugadoresActuales >= jugadoresMaximos - 1) {
            return { text: '¡Último Lugar!', color: '#FF9800', icon: 'alert-circle', bgColor: '#fff3e0' };
        } else {
            return { text: 'Lugares Disponibles', color: colors.primary, icon: 'checkmark-circle', bgColor: '#e8f5e9' };
        }
    };

    const estaAfiliado = () => {
        return partido.jugadores?.some((jugadorId) => {
            // Manejar si el jugador no está populado (sería solo un ID) o sí (objeto con _id)
            const id = jugadorId.jugadorId?._id || jugadorId.jugadorId || jugadorId;
            return id === user._id;
        });
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================
    const handleJoinMatch = async () => {
        Alert.alert(
            "Unirse al partido",
            "¿Estás seguro que deseas unirte a este partido?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Unirse",
                    onPress: async () => {
                        try {
                            await joinMatch(partido._id);
                            onRefresh();
                            showSuccess('¡Te has unido al partido exitosamente!');
                        } catch (error) {
                            showError('No se pudo unir al partido. Intenta nuevamente.');
                        }
                    }
                }
            ]
        );
    };

    const handleLeaveMatch = async () => {
        Alert.alert(
            "Retirarse del partido",
            "¿Estás seguro que deseas retirarte del partido?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Retirarse",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await leaveMatch(partido._id);
                            onRefresh();
                            showSuccess('Te has retirado del partido exitosamente');
                            navigation.goBack();
                        } catch (error) {
                            showError('Error al retirarse del partido');
                        }
                    }
                }
            ]
        );
    };

    const handleChatMatch = () => {
        setIsChatModalVisible(true);
    };

    const handleShareMatch = () => {
        showInfo('Función de compartir próximamente disponible');
    };

    const handleEditMatch = () => {
        setIsEditModalVisible(true);
    };

    const handleSendMessage = async (partidoId, nuevoMensaje) => {
        try {
            console.log('Enviando mensaje:', nuevoMensaje);
            showSuccess('Mensaje enviado correctamente');
        } catch (error) {
            console.error('Error sending message:', error);
            showError('Error al enviar el mensaje');
            throw error;
        }
    };

    return {
        partido,
        isEditModalVisible,
        setIsEditModalVisible,
        isChatModalVisible,
        setIsChatModalVisible,
        status: getPartidoStatus(),
        jugadoresActuales: partido.jugadores?.length || 0,
        jugadoresMaximos: partido.jugadoresMaximos || 4,
        lugaresDisponibles: (partido.jugadoresMaximos || 4) - (partido.jugadores?.length || 0),
        formatFechaCompleta,
        handleJoinMatch,
        handleLeaveMatch,
        handleChatMatch,
        handleShareMatch,
        handleEditMatch,
        handleSendMessage,
        estaAfiliado
    };
};
