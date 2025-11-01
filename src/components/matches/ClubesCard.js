import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  calcularDistancia,
  formatearDistancia,
  useLocation,
} from "../../hooks/useLocation";

const ClubCard = ({ club, ubicacionUsuario }) => {
  const { nombreClub, ciudad, localidad, jugadoresAfiliados, coordenadas } =
    club;

  // Determinar el tipo de instalaciones según el nombre del club
  const getInstalacionesTexto = (nombre) => {
    if (nombre.toLowerCase().includes("deportivo central")) {
      return "Instalaciones premium para pádel, tenis y natación";
    }
    return "Instalaciones públicas para múltiples deportes";
  };

  // Calcular distancia real si tenemos ubicación y coordenadas del club
  const obtenerDistancia = () => {
    // ⚠️ CORRECCIÓN: Verifica x e y (o lat y lng según tu estructura)
    if (!ubicacionUsuario || !coordenadas?.x || !coordenadas?.y) {
      return "-- km";
    }

    const distanciaKm = calcularDistancia(
      ubicacionUsuario.latitude,
      ubicacionUsuario.longitude,
      coordenadas.x, // latitud del club
      coordenadas.y // longitud del club (CORREGIDO)
    );

    return formatearDistancia(distanciaKm);
  };

  // Calcular miembros
  const miembros = jugadoresAfiliados?.length || 0;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Icono del club */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🏛️</Text>
        </View>

        <View style={styles.content}>
          {/* Nombre del club */}
          <Text style={styles.clubName}>{nombreClub}</Text>

          {/* Descripción */}
          <Text style={styles.description}>
            {getInstalacionesTexto(nombreClub)}
          </Text>

          {/* Info inferior */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{obtenerDistancia()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👥</Text>
              <Text style={styles.infoText}>{miembros} miembros</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ... estilos igual
const styles = StyleSheet.create({
  card: {
    backgroundColor: " #FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "600",
    color: " #111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default ClubCard;
