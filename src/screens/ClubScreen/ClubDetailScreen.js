import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../styles/global';
import { useUser } from '../../contexts/UserContext';
import { useClubs } from '../../contexts/ClubsContext';
import { useNotification } from '../../contexts/NotificationContext';

export default function ClubDetailScreen({ route, navigation }) {
  const { club: initialClub } = route.params;
  const { user, afiliarJugadorAClub, loadUserData, refreshUserData, desafiliarJugador } = useUser();
  const { getClubById } = useClubs();
  const { showNotification } = useNotification();

  const [clubData, setClubData] = useState(initialClub);
  const [loadingAffiliation, setLoadingAffiliation] = useState(false);
  const [isAffiliated, setIsAffiliated] = useState(false);
  const [refreshingUser, setRefreshingUser] = useState(false);

  console.log("clubData", clubData);
  console.log("userData", user.clubesAfiliados);



  // Mover handleOpenMap dentro del componente para usar clubData
  const handleOpenMap = () => {
    // Usar coordenadas del club o fallback a búsqueda por nombre/dirección
    const lat = clubData.coordenadas?.lat || clubData.latitud;
    const lng = clubData.coordenadas?.lng || clubData.longitud;

    // Si coordenadas es string "lat,lng"
    let latVal = lat;
    let lngVal = lng;

    if (!latVal && typeof clubData.coordenadas === 'string' && clubData.coordenadas.includes(',')) {
      [latVal, lngVal] = clubData.coordenadas.split(',');
    }

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = latVal && lngVal ? `${latVal},${lngVal}` : null;
    const label = clubData.nombreClub;

    let url = '';

    if (latLng) {
      url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });
    } else {
      // Búsqueda por query (nombre + localidad)
      const query = `${clubData.nombreClub}, ${clubData.localidad || ''}, ${clubData.provincia || ''}`;
      url = Platform.select({
        ios: `${scheme}${encodeURIComponent(query)}`,
        android: `${scheme}${encodeURIComponent(query)}`
      });
    }

    const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clubData.nombreClub} ${clubData.localidad || ''}`)}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(webUrl);
      }
    }).catch(() => Linking.openURL(webUrl));
  };

  const handleRefreshUser = async () => {
    setRefreshingUser(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error("Error refreshing user data", error);
      Alert.alert("Error", "No se pudo recargar el usuario");
    } finally {
      setRefreshingUser(false);
    }
  };

  // Verificar afiliación inicial
  useEffect(() => {
    if (user && user.clubesAfiliados) {
      const affiliated = user.clubesAfiliados.some(c => {
        // La estructura es { _id: "affiliationId", clubId: { _id: "CLUB_ID", ... }, ... }
        // Primero intentamos obtener el ID del club populado
        if (c.clubId && typeof c.clubId === 'object' && c.clubId._id) {
          return String(c.clubId._id) === String(clubData._id);
        }
        // Si clubId no está populado (es solo el ID string)
        if (c.clubId && typeof c.clubId === 'string') {
          return String(c.clubId) === String(clubData._id);
        }
        // Fallback: si c es el objeto club directo o un string ID
        const cId = (typeof c === 'object' && c && c._id) ? c._id : c;
        return String(cId) === String(clubData._id);
      });
      setIsAffiliated(affiliated);
    } else {
      setIsAffiliated(false);
    }
  }, [user, clubData._id, loadingAffiliation]);

  const handleAffiliationToggle = async () => {
    setLoadingAffiliation(true);
    try {
      if (isAffiliated) {
        // Desafiliar
        await desafiliarJugador({ clubId: clubData._id });
        Alert.alert("Éxito", `Te has desafiliado de ${clubData.nombreClub}`);
        setIsAffiliated(false); // Optimistic update
      } else {
        // Afiliar
        await afiliarJugadorAClub({ clubId: clubData._id });
        Alert.alert("Éxito", `Te has afiliado a ${clubData.nombreClub}`);
        setIsAffiliated(true); // Optimistic update
      }

      // Actualizar datos del club en tiempo real
      const updatedClub = await getClubById(clubData._id);
      if (updatedClub) {
        setClubData(updatedClub);
      }

      // Refrescar datos del usuario para mantener consistencia global
      await refreshUserData();

    } catch (error) {
      Alert.alert("Error", error?.message || "No se pudo realizar la acción");
      showNotification("Error", error?.message || "No se pudo realizar la acción");

    } finally {
      setLoadingAffiliation(false);
    }
  };

  const jugadoresCount = clubData.jugadoresAfiliados?.length || 0;
  const partidosCount = clubData.partidosActivos?.length || 0;

  // Calcular categorías
  const getCategoriasDistribution = () => {
    const categorias = {};
    clubData.jugadoresAfiliados?.forEach(jugador => {
      const categoria = jugador.categoria || 'No especificado';
      categorias[categoria] = (categorias[categoria] || 0) + 1;
    });
    return categorias;
  };

  const categoriasDistribution = getCategoriasDistribution();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Personalizado con Gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || '#004aad']}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {clubData.nombreClub}
        </Text>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={handleRefreshUser}
          disabled={refreshingUser}
        >
          {refreshingUser ? <ActivityIndicator color={colors.white} size="small" /> : <Ionicons name="reload" size={24} color={colors.white} />}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner / Hero Section */}
        <View style={styles.heroSection}>
          {/* Círculos decorativos de fondo */}
          <View style={styles.circleDecoration1} />
          <View style={styles.circleDecoration2} />

          <View style={styles.clubHeaderContent}>
            <View style={styles.clubIconContainer}>
              <LinearGradient
                colors={['#ffffff', '#f0f0f0']}
                style={styles.clubIconGradient}
              >
                <Ionicons name="business" size={40} color={colors.primary} />
              </LinearGradient>
            </View>
            <View style={[styles.clubTitleContainer, { flex: 1 }]}>
              <Text style={styles.heroClubName}>{clubData.nombreClub}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <View style={styles.locationTag}>
                  <Ionicons name="location-sharp" size={14} color={colors.white} />
                  <Text style={styles.heroLocation}>
                    {[clubData.localidad, clubData.ciudad].filter(Boolean).join(', ') || 'Ubicación no disponible'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleOpenMap}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4285F4', '#EA4335', '#FBBC05', '#34A853']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 8, padding: 1.5 }}
                  >
                    <View style={{
                      backgroundColor: colors.white,
                      borderRadius: 7,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name="map" size={14} color={colors.dark} />
                      <Text style={{ ...typography.caption, fontSize: 10, color: colors.dark, marginLeft: 4, fontWeight: '700' }}>
                        Ver Mapa
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Tarjeta de Membresía / Acción */}
          <View style={styles.membershipCard}>
            <View style={styles.membershipInfo}>
              <Text style={styles.membershipLabel}>Estado de Membresía</Text>
              <Text style={[styles.membershipStatus, isAffiliated ? styles.statusActive : styles.statusInactive]}>
                {isAffiliated ? 'Miembro Activo' : 'No Afiliado'}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isAffiliated ? styles.actionButtonOutline : styles.actionButtonSolid
              ]}
              onPress={handleAffiliationToggle}
              disabled={loadingAffiliation}
            >
              {loadingAffiliation ? (
                <ActivityIndicator size="small" color={isAffiliated ? colors.white : colors.white} />
              ) : (
                <>
                  <Ionicons
                    name={isAffiliated ? "log-out-outline" : "person-add-outline"}
                    size={20}
                    color={isAffiliated ? colors.white : colors.white}
                  />
                  <Text style={[styles.actionButtonText, isAffiliated && { color: colors.white }]}>
                    {isAffiliated ? 'Desafiliarse' : 'Afiliarse'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid de Estadísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="people" size={24} color="#1565c0" />
            </View>
            <Text style={styles.statValue}>{jugadoresCount}</Text>
            <Text style={styles.statLabel}>Miembros</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#fff3e0' }]}>
              <Ionicons name="tennisball" size={24} color="#ef6c00" />
            </View>
            <Text style={styles.statValue}>{partidosCount}</Text>
            <Text style={styles.statLabel}>Partidos</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="calendar" size={24} color="#2e7d32" />
            </View>
            <Text style={styles.statValue}>{clubData.canchasTotales || '-'}</Text>
            <Text style={styles.statLabel}>Canchas</Text>
          </View>
        </View>

        {/* Accesos Rápidos */}
        <View style={styles.quickLinksContainer}>
          <Text style={styles.sectionTitle}>Explorar Club</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickLinksScroll}>
            <TouchableOpacity style={styles.quickLinkCard} onPress={() => navigation.navigate('JugadoresClub', { club: clubData })}>
              <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.quickLinkGradient}>
                <Ionicons name="people-circle-outline" size={28} color="white" />
                <Text style={styles.quickLinkText}>Jugadores</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickLinkCard} onPress={() => navigation.navigate('PartidosActivosClub', { club: clubData })}>
              <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.quickLinkGradient}>
                <Ionicons name="play-circle-outline" size={28} color="white" />
                <Text style={styles.quickLinkText}>Partidos</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickLinkCard} onPress={() => console.log("Info")}>
              <LinearGradient colors={['#fa709a', '#fee140']} style={styles.quickLinkGradient}>
                <Ionicons name="information-circle-outline" size={28} color="white" />
                <Text style={styles.quickLinkText}> + Info</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Listado de Niveles / Distribución */}
        {Object.keys(categoriasDistribution).length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Niveles de Juego</Text>
            <View style={styles.levelsCard}>
              {Object.entries(categoriasDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([categoria, count], index) => {
                  const percentage = jugadoresCount > 0 ? ((count / jugadoresCount) * 100).toFixed(0) : 0;
                  return (
                    <View key={index} style={styles.levelRow}>
                      <View style={styles.levelInfo}>
                        <Text style={styles.levelName}>Nivel {categoria}</Text>
                        <Text style={styles.levelCount}>{count} jug.</Text>
                      </View>
                      <View style={styles.levelBarContainer}>
                        <LinearGradient
                          colors={[colors.primaryLight, colors.primary]}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={[styles.levelBar, { width: `${percentage}%` }]}
                        />
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {/* Información Detallada */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.infoCard}>
            {clubData.horarios && clubData.horarios.length > 0 && (
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={22} color={colors.gray} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Horarios</Text>
                  {clubData.horarios.map((h, i) => (
                    <Text key={i} style={styles.infoValue}>{h.dia}: {h.horaInicio} - {h.horaFin}</Text>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={22} color={colors.gray} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Dirección</Text>
                <Text style={styles.infoValue}>
                  {[clubData.direccion, clubData.localidad, clubData.provincia].filter(Boolean).join(', ') || "No especificada"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {

    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  circleDecoration1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  circleDecoration2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary + '10',
  },

  clubHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  clubIconContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  clubIconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  clubTitleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  heroClubName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 6,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  heroLocation: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Membership Card inside Hero
  membershipCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  membershipStatus: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusActive: {
    color: colors.primary,
  },
  statusInactive: {
    color: colors.gray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonSolid: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    // Estilo invertido para destacar más cuando NO eres miembro? 
    // Mejor naranja para "Afiliarse"
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonOutline: {
    backgroundColor: colors.red, // Desafiliarse
    borderColor: colors.red,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
  },

  // Quick Links
  quickLinksContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  quickLinksScroll: {
    paddingVertical: 10,
    gap: 12,
  },
  quickLinkCard: {
    width: 110,
    height: 100,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickLinkGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  quickLinkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },

  // Section Generic
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },

  // Levels
  levelsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  levelRow: {
    marginBottom: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  levelCount: {
    fontSize: 12,
    color: colors.gray,
  },
  levelBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelBar: {
    height: '100%',
    borderRadius: 3,
  },

  // Info Card
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
});