import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ClubCard from "../../../components/matches/ClubesCard";
import { colors, typography, spacing } from "../../../styles/global";
import { useClubs } from "../../../contexts/ClubsContext";
import { useLocation } from "../../../hooks/useLocation";

export default function ClubsList() {
  const { clubs, loading } = useClubs();
  const { ubicacion, error, cargando } = useLocation();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Clubes Destacados</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>

      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} ubicacionUsuario={ubicacion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
  },
  seeAll: {
    color: colors.secondary,
    fontWeight: "500",
  },
});
