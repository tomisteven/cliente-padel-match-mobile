import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../../../styles/global";

const ClubCard = ({ club, showDetails = true, onPress }) => {
  const jugadoresCount = club.jugadoresAfiliados?.length || 0;
  const partidosCount = club.partidosActivos?.length || 0;


  // Calcular nivel de actividad
  const getActivityLevel = () => {
    if (partidosCount > 5) return { level: "Alta", color: "#22C55E" };
    if (partidosCount > 2) return { level: "Media", color: "#F59E0B" };
    return { level: "Baja", color: "#6B7280" };
  };

  const activity = getActivityLevel();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header del card */}
      <View style={styles.cardHeader}>
        <View style={styles.clubBasicInfo}>
          <View style={styles.clubIcon}>
            <Ionicons name="business" size={24} color={colors.primary} />
          </View>
          <View style={styles.clubTitle}>
            <Text style={styles.clubName} numberOfLines={1}>
              {club.nombreClub}
            </Text>
            <View style={styles.activityBadge}>
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: activity.color },
                ]}
              />
              <Text style={styles.activityText}>
                Actividad {activity.level}
              </Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.gray} />
      </View>

      {/* Estadísticas del club */}
      {showDetails && (
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="people" size={16} color={colors.primary} />
            <Text style={styles.statNumber}>{jugadoresCount}</Text>
            <Text style={styles.statLabel}>Jugadores</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Ionicons name="tennisball" size={16} color={colors.primary} />
            <Text style={styles.statNumber}>{partidosCount}</Text>
            <Text style={styles.statLabel}>Partidos</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Ionicons name="time" size={16} color={colors.primary} />
            <Text style={styles.statNumber}>{club.horarios?.length || 0}</Text>
            <Text style={styles.statLabel}>Horarios</Text>
          </View>
        </View>
      )}

      {/* Información adicional */}
      {showDetails && (
        <View style={styles.additionalInfo}>
          {club.coordenadas && (
            <View style={styles.infoItem}>
              <Ionicons name="location" size={14} color={colors.gray} />
              <Text style={styles.infoText}>Ubicación disponible</Text>
            </View>
          )}

          {club.jugadoresAfiliados && club.jugadoresAfiliados.length > 0 && (
            <View style={styles.infoItem}>
              <Ionicons name="star" size={14} color={colors.gray} />
              <Text style={styles.infoText}>
                {club.jugadoresAfiliados.length} afiliados
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer con acción rápida */}
      <View style={styles.cardFooter}>
        <Text style={styles.viewDetailsText}>Ver detalles del club</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  clubBasicInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  clubIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  clubTitle: {
    flex: 1,
  },
  clubName: {
    ...typography.subtitle,
    color: colors.dark,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  activityBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  activityText: {
    ...typography.caption,
    color: colors.gray,
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    ...typography.title,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e9ecef",
  },
  additionalInfo: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    ...typography.caption,
    color: colors.gray,
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f3f4",
    paddingTop: spacing.md,
    alignItems: "center",
  },
  viewDetailsText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ClubCard;
