import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useMatches } from "../../../contexts/MatchesContext";
import { useUser } from "../../../contexts/UserContext";
import { useApi } from "../../../contexts/ApiContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { colors } from "../../../styles/global";

// ============================================================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================================================
export const MATCH_CATEGORIES = [
    {
        id: 'available',
        label: 'Disponibles',
        icon: 'tennisball',
        color: colors.primary,
    },
    {
        id: 'mine',
        label: 'Mis Partidos',
        icon: 'person',
        color: colors.secondary,
    },
    {
        id: 'completed',
        label: 'Completos',
        icon: 'checkmark-circle-outline',
        color: '#FFD700',
        // Ejemplo de propiedad para query al API
        // apiQuery: { estado: 'completo' }
    },
];

export const useMatchesLogic = (navigation) => {
    const { matches: contextMatches, loading: contextLoading, joinMatch, leaveMatch, refreshMatches, filterMatches } = useMatches();
    const { localidades } = useApi();
    const { user } = useUser();
    const { showSuccess } = useNotification();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('available');
    const [displayMatches, setDisplayMatches] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);

    // ============================================================================
    // LOGICA DE FILTRADO LOCAL
    // ============================================================================
    const isUserInMatch = (match) => {
        if (!match.jugadores || !user?._id) return false;
        const userId = user._id.toString();
        return match.jugadores.some((j) => {
            // Manejar estructura populada objeto o string ID
            const playerId = (j.jugadorId?._id || j.jugadorId || j._id || j)?.toString();
            return playerId === userId;
        });
    };

    const isMatchCompleted = (match) => {
        const jugadoresActuales = match.jugadores?.length || 0;
        const jugadoresMaximos = match.jugadoresMaximos || 4;
        return jugadoresActuales >= jugadoresMaximos || match.estado === 'completo';
    };

    const filterLocalMatches = (list, categoryId) => {
        switch (categoryId) {
            case 'available': return list.filter(m => !isMatchCompleted(m));
            case 'mine': return list.filter(m => isUserInMatch(m));
            case 'completed': return list.filter(m => isMatchCompleted(m));
            default: return list;
        }
    };

    // ============================================================================
    // EFECTO: MANEJO DE CAMBIO DE CATEGORÍA
    // ============================================================================
    useEffect(() => {
        const updateMatches = async () => {
            setLocalLoading(true);

            const categoryConfig = MATCH_CATEGORIES.find(c => c.id === activeCategory);

            try {
                if (categoryConfig?.apiQuery) {
                    // Si la categoría tiene query de API, usamos filterMatches del context
                    const apiMatches = await filterMatches(categoryConfig.apiQuery);
                    setDisplayMatches(apiMatches || []);
                } else {
                    // Si no, filtramos localmente los partidos del context
                    // Aseguramos que contextMatches sea un array antes de filtrar
                    const matchesToFilter = Array.isArray(contextMatches) ? contextMatches : [];
                    const localFiltered = filterLocalMatches(matchesToFilter, activeCategory);
                    setDisplayMatches(localFiltered);
                }
            } catch (error) {
                console.error("Error updating matches view:", error);
                setDisplayMatches([]);
            } finally {
                setLocalLoading(false);
            }
        };

        updateMatches();
    }, [activeCategory, contextMatches]);

    // ============================================================================
    // HANDLERS
    // ============================================================================
    const onRefresh = async () => {
        setLocalLoading(true);
        setRefreshing(true);
        await refreshMatches();
        setRefreshing(false);
        setLocalLoading(false);
    };

    const handleJoinMatch = async (matchId) => {
        Alert.alert(
            "Unirse al partido",
            "¿Estás seguro que deseas unirte a este partido?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Unirse",
                    onPress: async () => {
                        try {
                            await joinMatch(matchId);
                            onRefresh();
                            showSuccess('Te has unido al partido exitosamente');
                        } catch (error) {
                            console.error("Error joining match:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleLeaveMatch = async (matchId) => {
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
                            await leaveMatch(matchId);
                            onRefresh();
                            showSuccess('Te has retirado del partido exitosamente');
                        } catch (error) {
                            console.error("Error leaving match:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleDetailsPress = (partido) => {
        navigation.navigate('MatchDetail', { partido });
    };

    return {
        // State
        showCreateModal,
        setShowCreateModal,
        refreshing,
        activeCategory,
        setActiveCategory,
        displayMatches,
        localLoading,
        contextLoading,
        localidades,

        // Config
        MATCH_CATEGORIES,

        // Handlers
        onRefresh,
        handleJoinMatch,
        handleLeaveMatch,
        handleDetailsPress,
        isUserInMatch
    };
};
