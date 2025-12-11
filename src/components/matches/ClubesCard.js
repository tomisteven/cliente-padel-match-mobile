import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  calcularDistancia,
  formatearDistancia,
  useLocation,
} from "../../hooks/useLocation";
import { colors } from "../../styles/global";

const ClubCard = ({ club, ubicacionUsuario, navigation, onPress, isAffiliated }) => {
  const { nombreClub, ciudad, localidad, jugadoresAfiliados, coordenadas } = club;

  const getInstalacionesTexto = (nombre) => {
    if (nombre.toLowerCase().includes("deportivo central")) {
      return "Instalaciones premium para pádel, tenis y natación";
    }
    return "Instalaciones públicas para múltiples deportes";
  };

  const obtenerDistancia = () => {
    if (!ubicacionUsuario || !coordenadas?.x || !coordenadas?.y) {
      return "-- km";
    }

    const distanciaKm = calcularDistancia(
      ubicacionUsuario.latitude,
      ubicacionUsuario.longitude,
      coordenadas.x,
      coordenadas.y
    );

    return formatearDistancia(distanciaKm);
  };

  // Calcular miembros
  const miembros = jugadoresAfiliados?.length || 0;

  return (
    <TouchableOpacity
      style={[styles.card, isAffiliated && styles.affiliatedCard]}
      activeOpacity={0.9}
      onPress={() => onPress(club)}
    >
      {isAffiliated && (
        <LinearGradient
          colors={[colors.primary, '#4285F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badgeContainer}
        >
          <Text style={styles.badgeText}>MIEMBRO</Text>
        </LinearGradient>
      )}
      <View style={[styles.container, isAffiliated && styles.affiliatedContainer]}>
        <View style={styles.iconContainer}>
          {/* Si tiene imagen mostramos imagen, sino el icono */}
          <LinearGradient
            colors={isAffiliated ? [colors.primaryLight, colors.primary] : ['#F3F4F6', '#E5E7EB']}
            style={styles.iconGradient}
          >
            <Text style={styles.iconText}>{isAffiliated ? '👑' : '🏛️'}</Text>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <Text style={styles.clubName} numberOfLines={1}>{nombreClub}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {getInstalacionesTexto(nombreClub)}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.infoText}>{obtenerDistancia()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={14} color="#6B7280" />
              <Text style={styles.infoText}>{miembros} miembros</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.gray} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  affiliatedCard: {
    borderColor: 'rgba(66, 133, 244, 0.5)', // Color primario suave
    backgroundColor: '#F8FAFF',
    transform: [{ scale: 1.02 }], // Un poco más grande para destacar
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: 'center',
  },
  affiliatedContainer: {
    backgroundColor: '#F8FAFF', // Fondo sutilmente azulado
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: '500',
  },
  arrowContainer: {
    marginLeft: 8,
  },
});

export default ClubCard;
