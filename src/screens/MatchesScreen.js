import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMatches } from "../contexts/MatchesContext";
import { useUser } from "../contexts/UserContext";
import { colors, typography, spacing } from "../styles/global";
import MatchesList from "./HomeScreen/components/MatchesList";
import { RefreshControl } from "react-native";
import { useLocation } from "../hooks/useLocation";

export default function MatchesScreen() {
  const { matches, loading, joinMatch, leaveMatch } = useMatches();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const { ubicacion } = useLocation();

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleJoinMatch = async (matchId) => {
    try {
      await joinMatch(matchId);
    } catch (error) {
      console.error("Error joining match:", error);
    }
  };

  const handleLeaveMatch = async (matchId) => {
    try {
      await leaveMatch(matchId);
    } catch (error) {
      console.error("Error leaving match:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando partidos...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="tennisball-outline" size={64} color={colors.gray} />
          <Text style={styles.emptyText}>No hay partidos disponibles</Text>
        </View>
      ) : (
        <MatchesList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    ...typography.title,
    color: colors.dark,
  },
  filterButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray,
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
  matchCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchTitle: {
    ...typography.subtitle,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  matchLocation: {
    ...typography.caption,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  matchDate: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  matchActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
