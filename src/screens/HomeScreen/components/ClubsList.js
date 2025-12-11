import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ClubCard from "../../../components/matches/ClubesCard";
import { colors, typography, spacing } from "../../../styles/global";
import { useClubs } from "../../../contexts/ClubsContext";
import { useLocation } from "../../../hooks/useLocation";

export default function ClubsList({ navigation }) {
  const { clubs, loading } = useClubs();
  const { ubicacion, error, cargando } = useLocation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando clubes...</Text>
      </View>
    );
  }

  const handleClubPress = (club) => {
    console.log("club", club);


    navigation.navigate("ClubDetail", { club });
  };

  const handleSeeAll = () => {
    // Navegar a una pantalla con todos los clubes
    navigation.navigate("AllClubs");
  };

  // Calcular estadísticas generales
  const totalJugadores = clubs.reduce(
    (total, club) => total + (club.jugadoresAfiliados?.length || 0),
    0
  );
  const totalPartidosActivos = clubs.reduce(
    (total, club) => total + (club.partidosActivos?.length || 0),
    0
  );



  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem} onPress={handleSeeAll}>
            <Ionicons name="business" size={20} color={colors.white} />
            <Text style={styles.statNumber}>{clubs.length}</Text>
            <Text style={styles.statLabel}>Clubes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color={colors.white} />
            <Text style={styles.statNumber}>{totalJugadores}</Text>
            <Text style={styles.statLabel}>Jugadores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="tennisball" size={20} color={colors.white} />
            <Text style={styles.statNumber}>{totalPartidosActivos}</Text>
            <Text style={styles.statLabel}>Partidos</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección de clubes destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Clubes Destacados</Text>
              <Text style={styles.sectionSubtitle}>
                Los clubes más activos de la comunidad
              </Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAll}
            >
              <Text style={styles.seeAllText}>Ver todos</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Lista de clubes */}
          <View style={styles.clubsGrid}>
            {clubs.map((club, index) => (
              <TouchableOpacity
                key={club._id}
                style={styles.clubCardWrapper}

              >
                <ClubCard
                  onPress={() => handleClubPress(club)}
                  club={club}
                  ubicacionUsuario={ubicacion}
                  navigation={navigation}
                  showDetails={true}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sección de clubes cercanos si hay ubicación */}
        {ubicacion && !cargando && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Cerca de Ti</Text>
                <Text style={styles.sectionSubtitle}>
                  Clubes en tu ubicación actual
                </Text>
              </View>
              <Ionicons name="location" size={20} color={colors.primary} />
            </View>

            <View style={styles.nearbyClubs}>
              {clubs
                .filter((club) => club.coordenadas)
                .slice(0, 2)
                .map((club) => (
                  <TouchableOpacity
                    key={club._id}
                    style={styles.nearbyClubCard}
                    onPress={() => handleClubPress(club)}
                  >
                    <View style={styles.nearbyClubHeader}>
                      <Ionicons
                        name="location"
                        size={16}
                        color={colors.accent}
                      />
                      <Text style={styles.nearbyClubDistance}>~1.2 km</Text>
                    </View>
                    <Text style={styles.nearbyClubName}>{club.nombreClub}</Text>
                    <View style={styles.nearbyClubStats}>
                      <Text style={styles.nearbyClubStat}>
                        {club.jugadoresAfiliados?.length || 0} jugadores
                      </Text>
                      <Text style={styles.nearbyClubStat}>
                        {club.partidosActivos?.length || 0} partidos
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.gray,
    backgroundColor: colors.primaryDark
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: -spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.white,
    fontSize: 25,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.body,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 16,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    ...typography.title,
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
    color: colors.dark,
    fontWeight: "600",
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.gray,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 2,
  },
  clubsGrid: {
    gap: spacing.md,
  },
  clubCardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  nearbyClubs: {
    gap: spacing.md,
  },
  nearbyClubCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  nearbyClubHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  nearbyClubDistance: {
    ...typography.caption,
    color: colors.accent,
    marginLeft: spacing.xs,
    fontWeight: "500",
  },
  nearbyClubName: {
    ...typography.body,
    color: colors.dark,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  nearbyClubStats: {
    flexDirection: "row",
    gap: spacing.md,
  },
  nearbyClubStat: {
    ...typography.caption,
    color: colors.gray,
  },
});
