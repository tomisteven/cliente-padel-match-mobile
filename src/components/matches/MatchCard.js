import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import { colors, typography, spacing } from "../../styles/global";
import { useLocation } from "../../hooks/useLocation";

export default function MatchCard({ match, onJoin, onLike, onShare }) {
  const {
    _id,
    categoria,
    clubId,
    nombreClub,
    jugadores,
    estado,
    exprire_at,
    coordenadas,
    created_at,
  } = match;

  const { ubicacion } = useLocation();

  const ubicacionUsuarioLat = ubicacion?.latitude;
  const ubicacionUsuarioLong = ubicacion?.longitude;
  const coordenadaClubX = coordenadas?.x;
  const coordenadaClubY = coordenadas?.y;

  // Calcular distancia si hay coordenadas del club y ubicación del usuario
  const calcularDistancia = () => {
    if (!ubicacion || !coordenadaClubX || !coordenadaClubY) {
      return "--";
    }

    const R = 6371; // Radio de la Tierra en km
    const dLat = ((coordenadaClubX - ubicacionUsuarioLat) * Math.PI) / 180;
    const dLon = ((coordenadaClubY - ubicacionUsuarioLong) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((ubicacionUsuarioLat * Math.PI) / 180) *
        Math.cos((coordenadaClubX * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    if (distancia < 1) {
      return `${Math.round(distancia * 1000)} m`;
    }
    return `${distancia.toFixed(1)} km`;
  };

  // Formatear fecha de expiración
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diff = date - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Expira en ${days}d`;
    if (hours > 0) return `Expira en ${hours}h`;
    return "Expira pronto";
  };

  // Obtener color según el estado
  const getEstadoColor = () => {
    switch (estado) {
      case "pendiente":
        return colors.warning || "#F59E0B";
      case "confirmado":
        return colors.success || "#10B981";
      case "cancelado":
        return colors.error || "#EF4444";
      default:
        return colors.gray;
    }
  };

  // Calcular jugadores faltantes (match de pádel = 4 jugadores)
  const maxJugadores = 4;
  const jugadoresActuales = jugadores?.length || 0;
  const jugadoresFaltantes = maxJugadores - jugadoresActuales;

  return (
    <Card style={styles.matchCard}>
      <View style={styles.cardHeader}>
        <View style={styles.matchInfo}>
          <View style={styles.matchIcon}>
            <Ionicons name="tennisball" size={24} color={colors.primary} />
          </View>
          <View style={styles.matchDetails}>
            <Text style={styles.matchTitle}>{nombreClub}</Text>
            <Text style={styles.matchSubtitle}>
              Creado el: {new Date(created_at).toLocaleDateString()}
            </Text>

            <Text style={styles.matchSubtitle}>
             {formatearFecha(exprire_at)}
            </Text>
          </View>
        </View>
        <View
          style={[styles.estadoBadge, { backgroundColor: getEstadoColor() }]}
        >
          <Text style={styles.estadoText}>{estado}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.categoriaContainer}>
          <Ionicons name="trophy" size={16} color={colors.primary} />
          <Text style={styles.categoriaText}>Categoría {categoria}</Text>
        </View>

        {jugadores && jugadores.length > 0 && (
          <View style={styles.jugadoresContainer}>
            <Text style={styles.jugadoresTitle}>Jugadores confirmados:</Text>
            {jugadores.map((jugador) => (
              <View key={jugador._id} style={styles.jugadorItem}>
                <Ionicons name="person" size={14} color={colors.gray} />
                <Text style={styles.jugadorNombre}>{jugador.nombre}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.matchMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={16} color={colors.gray} />
            <Text style={styles.metaText}>
              {jugadoresActuales}/{maxJugadores} jugadores
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={16} color={colors.gray} />
            <Text style={styles.metaText}>
              {calcularDistancia(
                coordenadaClubX,
                ubicacionUsuarioLat,
                coordenadaClubY,
                ubicacionUsuarioLong
              )}
            </Text>
          </View>
        </View>

        {jugadoresFaltantes > 0 && (
          <View style={styles.faltanContainer}>
            <Text style={styles.faltanText}>
              {jugadoresFaltantes === 1
                ? "¡Solo falta 1 jugador!"
                : `Faltan ${jugadoresFaltantes} jugadores`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            jugadoresActuales >= maxJugadores && styles.joinButtonDisabled,
          ]}
          onPress={onJoin}
          disabled={jugadoresActuales >= maxJugadores}
        >
          <Text style={styles.joinButtonText}>
            {jugadoresActuales >= maxJugadores ? "Completo" : "Unirse"}
          </Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike}>
            <Ionicons
              name={match.liked ? "heart" : "heart-outline"}
              size={24}
              color={match.liked ? colors.accent : colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  matchCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  matchInfo: {
    flexDirection: "row",
    flex: 1,
  },
  matchIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.light || "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  matchDetails: {
    flex: 1,
  },
  matchTitle: {
    ...typography.subtitle,
    marginBottom: 4,
  },
  matchSubtitle: {
    ...typography.caption,
    color: colors.gray || "#6B7280",
  },
  estadoBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: colors.white || "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardBody: {
    marginBottom: spacing.sm,
  },
  categoriaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoriaText: {
    ...typography.body,
    marginLeft: 6,
    fontWeight: "600",
  },
  jugadoresContainer: {
    backgroundColor: colors.light || "#F9FAFB",
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  jugadoresTitle: {
    ...typography.caption,
    fontWeight: "600",
    marginBottom: 6,
  },
  jugadorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  jugadorNombre: {
    ...typography.caption,
    marginLeft: 6,
  },
  matchMeta: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.lg,
  },
  metaText: {
    ...typography.caption,
    marginLeft: 4,
  },
  faltanContainer: {
    backgroundColor: "#FEF3C7",
    padding: spacing.sm,
    borderRadius: 8,
  },
  faltanText: {
    color: "#92400E",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  joinButtonDisabled: {
    backgroundColor: colors.gray || "#9CA3AF",
  },
  joinButtonText: {
    color: colors.white || "#FFFFFF",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
});
