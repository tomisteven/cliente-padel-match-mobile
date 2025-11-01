import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import Header from "../../components/common/Header";
//import MatchCard from "../../components/matches/MatchCard";
import { colors, typography, spacing } from "../../styles/global";
import ClubsList from "./components/ClubsList";
import MatchesList from "./components/MatchesList";
import { useLocation } from "../../hooks/useLocation";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { ubicacion, error, cargando } = useLocation();

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MatchesList ubicacionUsuario={ubicacion} />
        <ClubsList ubicacionUsuario={ubicacion} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
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
