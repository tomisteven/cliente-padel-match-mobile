import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useClubs } from "../../contexts/ClubsContext";
import { useLocation } from "../../hooks/useLocation";
import { colors, typography, spacing } from "../../styles/global";
import ClubCard from "../../components/matches/ClubesCard";
import { useUser } from "../../contexts/UserContext";
import { LinearGradient } from 'expo-linear-gradient';

export default function ClubsScreen() {
  const navigation = useNavigation();
  const { clubs, loading, refreshClubs } = useClubs();
  const { refreshUserData } = useUser();
  const { user } = useUser();
  const { ubicacion } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshClubs();
    await refreshUserData();
    setRefreshing(false);
  };

  // Helper para verificar afiliación con lógica robusta
  const checkIsAffiliated = (clubId) => {
    if (!user || !user.clubesAfiliados) return false;
    return user.clubesAfiliados.some(c => {
      // Caso: c es un objeto de afiliación
      if (typeof c === 'object' && c !== null) {
        // 1. clubId populado (objeto)
        if (c.clubId && typeof c.clubId === 'object' && c.clubId._id) {
          return String(c.clubId._id) === String(clubId);
        }
        // 2. clubId no populado (string)
        if (c.clubId) {
          return String(c.clubId) === String(clubId);
        }
        // 3. Fallback disparatado (por si c es el club directo)
        if (c._id) return String(c._id) === String(clubId);
      }
      // Caso: c es un ID string directo
      return String(c) === String(clubId);
    });
  };

  // Filtrar y ordenar clubes
  const processedClubs = useMemo(() => {
    let result = clubs;

    // 1. Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((club) => {
        const nombreMatch = club.nombreClub?.toLowerCase().includes(query);
        const ciudadMatch = club.ciudad?.toLowerCase().includes(query);
        const localidadMatch = club.localidad?.toLowerCase().includes(query);
        return nombreMatch || ciudadMatch || localidadMatch;
      });
    }

    // 2. Ordenar alfabéticamente por defecto
    return result.sort((a, b) => (a.nombreClub || "").localeCompare(b.nombreClub || ""));
  }, [clubs, searchQuery]);

  // Separar clubes afiliados si no hay búsqueda
  const { myClubs, otherClubs } = useMemo(() => {
    if (searchQuery.trim()) {
      return { myClubs: [], otherClubs: processedClubs };
    }
    const my = [];
    const other = [];
    processedClubs.forEach(club => {
      if (checkIsAffiliated(club._id)) {
        my.push(club);
      } else {
        other.push(club);
      }
    });
    return { myClubs: my, otherClubs: other };
  }, [processedClubs, user, searchQuery]);

  const handleClubPress = (club) => {
    navigation.navigate("ClubDetail", { club });
  };

  // Calcular estadísticas
  const totalJugadores = clubs.reduce(
    (total, club) => total + (club.jugadoresAfiliados?.length || 0),
    0
  );

  const clubesAfiliadosCount = user?.clubesAfiliados?.length || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header con Gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || '#004aad']}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Clubes</Text>
              <Text style={styles.subtitle}>Encuentra tu lugar para jugar</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Ionicons name="business" size={24} color={colors.white} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{clubesAfiliadosCount}</Text>
              </View>
            </View>
          </View>

          {/* Barra de Búsqueda Integrada en el Header */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar club, ciudad o zona..."
              placeholderTextColor={colors.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Contenido Principal */}
      <View style={styles.mainContent}>
        {/* Estadísticas Rápidas (Flotantes) */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalJugadores}</Text>
            <Text style={styles.statLabel}>Jugadores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{clubesAfiliadosCount}</Text>
            <Text style={styles.statLabel}>Mis Clubes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{clubs.length}</Text>
            <Text style={styles.statLabel}>Total Clubes</Text>
          </View>
        </View>

        {/* Resultados de Búsqueda */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              {processedClubs.length} {processedClubs.length === 1 ? 'resultado' : 'resultados'} encontrados
            </Text>
          </View>
        )}

        {/* Lista de Clubes */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando clubes...</Text>
            </View>
          ) : processedClubs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={colors.gray} />
              <Text style={styles.emptyTitle}>No se encontraron clubes</Text>
              <Text style={styles.emptyText}>
                Intenta con otros términos de búsqueda o recarga la lista.
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {/* Modo Búsqueda: Lista Plana */}
              {searchQuery.trim().length > 0 ? (
                processedClubs.map((club) => (
                  <ClubCard
                    key={club._id}
                    club={club}
                    ubicacionUsuario={ubicacion}
                    navigation={navigation}
                    onPress={handleClubPress}
                    isAffiliated={checkIsAffiliated(club._id)}
                  />
                ))
              ) : (
                /* Modo Normal: Secciones */
                <>
                  {myClubs.length > 0 && (
                    <View style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Ionicons name="star" size={18} color={colors.primary} />
                        <Text style={styles.sectionTitle}>Mis Clubes Afiliados {myClubs.length} / 4</Text>
                      </View>
                      {myClubs.map((club) => (
                        <ClubCard
                          key={club._id}
                          club={club}
                          ubicacionUsuario={ubicacion}
                          navigation={navigation}
                          onPress={handleClubPress}
                          isAffiliated={true}
                        />
                      ))}
                    </View>
                  )}

                  {otherClubs.length > 0 && (
                    <View style={styles.sectionContainer}>
                      {myClubs.length > 0 && (
                        <View style={styles.sectionHeader}>
                          <Ionicons name="business-outline" size={18} color={colors.gray} />
                          <Text style={[styles.sectionTitle, { color: colors.gray }]}>Otros Clubes</Text>
                        </View>
                      )}
                      {otherClubs.map((club) => (
                        <ClubCard
                          key={club._id}
                          club={club}
                          ubicacionUsuario={ubicacion}
                          navigation={navigation}
                          onPress={handleClubPress}
                          isAffiliated={false}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Fondo gris muy claro
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 30, // Espacio extra para el buscador
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  headerIconContainer: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFC107',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.dark,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.dark,
  },
  mainContent: {
    flex: 1,
    marginTop: -20, // Superposición con el header
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  resultsInfo: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 13,
    color: colors.gray,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  listContainer: {
    paddingTop: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.gray,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 8,
  },
});
