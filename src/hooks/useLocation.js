import { useState, useEffect } from "react";
import * as Location from "expo-location";

// Función para calcular distancia entre dos coordenadas (fórmula de Haversine)
export const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;

  return distancia; // retorna en kilómetros
};

// Función para formatear la distancia
export const formatearDistancia = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

// Hook personalizado para obtener ubicación con Expo
export const useLocation = () => {
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const obtenerUbicacion = async () => {
    setCargando(true);
    //console.log("Cargando ubicación...");
    try {
      // Solicitar permisos
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permiso de ubicación denegado");
        setCargando(false);
        return;
      }


      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setError(null);

     
    } catch (err) {
      console.error("Error obteniendo ubicación:", err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  return {
    ubicacion,
    error,
    cargando,
    recargar: obtenerUbicacion,
  };
};

// Hook para calcular distancia a un punto específico
export const useDistancia = (latDestino, lonDestino) => {
  const { ubicacion, error, cargando } = useLocation();
  const [distancia, setDistancia] = useState(null);

  useEffect(() => {
    if (ubicacion && latDestino && lonDestino) {
      const dist = calcularDistancia(
        ubicacion.latitude,
        ubicacion.longitude,
        latDestino,
        lonDestino
      );
      setDistancia(dist);
    }
  }, [ubicacion, latDestino, lonDestino]);

  return {
    distancia: distancia ? formatearDistancia(distancia) : null,
    distanciaKm: distancia,
    error,
    cargando,
  };
};
