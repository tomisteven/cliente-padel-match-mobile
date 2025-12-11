import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  RefreshControl,
} from "react-native";
import MatchCard from "../../../components/matches/MatchCard";
import { colors, typography, spacing } from "../../../styles/global";
import { useMatches } from "../../../contexts/MatchesContext";

export default function MatchesList({ ubicacionUsuario}) {
  const { matches, refreshMatches } = useMatches();
  //console.log("Matches:", matches);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    refreshMatches();
  };

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay partidos disponibles</Text>
        <Button
          style={styles.joinButton}
          title="Crear Partido"
          onPress={() => console.log("Crear partido")}
        />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Partidos Activos</Text>
        <Text style={styles.seeAll}>Ver todos</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {matches.map((match) => (
          <MatchCard
            key={match._id}
            match={match}
            ubicacionUsuario={ubicacionUsuario}
          />
        ))}
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.md,
  },
  joinButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  seeAll: {
    color: colors.secondary,
    fontWeight: "500",
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
});
