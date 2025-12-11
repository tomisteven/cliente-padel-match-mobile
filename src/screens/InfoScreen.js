import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../contexts/UserContext";
import { colors } from "../styles/global";
import { useNavigation } from "@react-navigation/native";
import EditProfileModal from "../components/modals/EditProfileModal";

export default function InfoScreen() {
  const { user, logout } = useUser();
  const navigation = useNavigation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Obtener nivel basado en categoría
  const getCategoryLevel = (category) => {
    const levels = {
      8: "Principiante",
      7: "Intermedio",
      6: "Int / Avanzado",
      5: "Avanzado",
      4: "Muy Regular",
      3: "Inicio AJPP",
      2: "Semi Pro",
      1: "Profesional",
    };
    return levels[category] || `Nivel ${category}`;
  };

  // Obtener iniciales
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fondo Gradiente Sutil */}


      {/* Hero Gradient Header */}


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Custom Hero Spacer for overlap effect */}
        <View style={styles.heroSpacer} />

        {/* Main User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primaryLight, colors.primary]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{getInitials(user?.nombre)}</Text>
            </LinearGradient>
            <View style={styles.onlineBadge}>
              <Ionicons name="checkmark" size={12} color={colors.white} />
            </View>
          </View>

          <Text style={styles.userName}>{user?.nombre || "Usuario"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {/* Quick Edit Profile Button (Visible & Easy) */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Text style={styles.editProfileText}>Editar Perfil</Text>
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </TouchableOpacity>


          <View style={styles.roleContainer}>
            <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
            <Text style={styles.roleText}>{user?.rol || "Jugador"}</Text>
          </View>

        </View>

        {/* Stats Grid - Colorful & Intutive */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
            <View style={[styles.statIconBadge, { backgroundColor: '#BBDEFB' }]}>
              <Ionicons name="tennisball" size={20} color="#1976D2" />
            </View>
            <Text style={[styles.statValue, { color: '#1976D2' }]}>
              {user?.partidosActivos?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: '#1976D2' }]}>Partidos</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#F3E5F5' }]}>
            <View style={[styles.statIconBadge, { backgroundColor: '#E1BEE7' }]}>
              <Ionicons name="business" size={20} color="#7B1FA2" />
            </View>
            <Text style={[styles.statValue, { color: '#7B1FA2' }]}>
              {user?.clubesAfiliados?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: '#7B1FA2' }]}>Clubes</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: '#FFF3E0' }]}>
            <View style={[styles.statIconBadge, { backgroundColor: '#FFE0B2' }]}>
              <Ionicons name="star" size={20} color="#F57C00" />
            </View>
            <Text style={[styles.statValue, { color: '#F57C00' }]}>
              {user?.calificaciones?.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: '#F57C00' }]}>Reseñas</Text>
          </View>
        </View>


        {/* Navigation Action: Mis Partidos */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Partidos")}
        >
          <LinearGradient
            colors={[colors.primary, '#42A5F5']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="calendar" size={24} color={colors.white} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Ver Mis Partidos</Text>
                <Text style={styles.actionSubtitle}>Gestiona tus encuentros activos e historial</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>


        {/* Details Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Detalles del Jugador</Text>

          {/* Level Card */}
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.levelCard}
          >
            <View>
              <Text style={styles.levelLabel}>Nivel de Juego</Text>
              <Text style={styles.levelValue}>{getCategoryLevel(user?.categoria)}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelNumber}>{user?.categoria}</Text>
            </View>
          </LinearGradient>

          {/* Personal Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="call" size={18} color="#1976D2" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Celular</Text>
                <Text style={styles.infoValue}>{user?.celular || "No especificado"}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="location" size={18} color="#388E3C" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ubicación</Text>
                <Text style={styles.infoValue}>
                  {user?.localidad && user?.provincia
                    ? `${user.localidad}, ${user.provincia}`
                    : "Ubicación no especificada"}
                </Text>
              </View>
            </View>

            {user?.clubFavorito && (
              <>
                <View style={styles.separator} />
                <View style={styles.infoRow}>
                  <View style={[styles.iconCircle, { backgroundColor: '#FDEDEC' }]}>
                    <Ionicons name="heart" size={18} color="#D32F2F" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Club Favorito</Text>
                    <Text style={styles.infoValue}>{user.clubFavorito}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Clubes Afiliados Chips */}
        {user?.clubesAfiliados && user.clubesAfiliados.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={styles.sectionTitle}>Mis Clubes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Clubes")}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
              {user.clubesAfiliados.map((club, index) => (
                <View key={club._id || index} style={styles.clubChip}>
                  <View style={styles.clubChipIcon}>
                    <Ionicons name="business" size={14} color={colors.white} />
                  </View>
                  <Text style={styles.clubChipText}>{club.nombreClub}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Menu */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.menuContainer}>

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="notifications" size={20} color="#F57C00" />
              </View>
              <Text style={styles.menuText}>Notificaciones</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#388E3C" />
              </View>
              <Text style={styles.menuText}>Privacidad y Seguridad</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>

          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FFEBEE', '#FFCDD2']}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SportMatch v1.0.0</Text>
        </View>

      </ScrollView>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  headerGradient: {
    height: 60, // Taller header
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  headerEditButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
    marginTop: -40, // Pull up to overlap with header
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSpacer: {
    height: 60,
  },
  userCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  editProfileText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionGradient: {
    borderRadius: 20,
    padding: 4,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)', // Glass effect overlay if wanted, or just transparent
    padding: 16,
    borderRadius: 16,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
    marginLeft: 4,
  },
  levelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  levelLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  levelValue: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  levelNumber: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  clubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  clubChipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clubChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  logoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: colors.gray,
    fontSize: 12,
    opacity: 0.6,
  },
});
