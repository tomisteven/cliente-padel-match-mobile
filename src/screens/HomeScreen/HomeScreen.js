import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing } from "../../styles/global";
import { useApi } from "../../contexts/ApiContext";
import { useNavigation } from "@react-navigation/native";



export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { estadisticas, loading, error, loadEstadisticas } = useApi();
  const navigation = useNavigation();


  useEffect(() => {
    loadEstadisticas();
  }, []);


  const onRefresh = async () => {
    setRefreshing(true);
    await loadEstadisticas();
    setRefreshing(false);
  };

  // Formatear números con separadores de miles
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return parseInt(num).toLocaleString('es-AR');
  };

  // Formatear porcentajes (ENTEROS)
  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0%';
    return `${Math.round(num)}%`;
  };

  if (loading || !estadisticas) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorTitle}>Error al cargar datos</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { resumen, jugadores, clubes, partidos, geografia } = estadisticas;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#F0F4FF', '#FFFFFF', '#F0F4FF']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Hero Gradient Header */}
      <LinearGradient
        colors={['#016b1fff', '#6dd5ed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Estadísticas en tiempo real</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.heroSpacer} />

        {/* Resumen Cards (Top 3 Important Metrics) */}
        <View style={styles.summaryRow}>

          {/* Total Jugadores */}
          <TouchableOpacity
            style={[styles.summaryCard, { borderLeftColor: '#2196F3' }]}
            onPress={() => navigation.navigate('Players')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="people" size={20} color="#1976D2" />
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: '#1976D2' }]}>
                {formatNumber(resumen?.totalJugadores)}
              </Text>
              <Text style={styles.summaryLabel}>Jugadores</Text>
            </View>
          </TouchableOpacity>

          {/* Total Clubes */}
          <TouchableOpacity
            style={[styles.summaryCard, { borderLeftColor: '#9C27B0' }]}
            onPress={() => navigation.navigate('Clubs')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="business" size={20} color="#7B1FA2" />
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: '#7B1FA2' }]}>
                {formatNumber(resumen?.totalClubes)}
              </Text>
              <Text style={styles.summaryLabel}>Clubes</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={[styles.summaryRow, { marginTop: 12 }]}>
          {/* Total Partidos */}
          <TouchableOpacity
            style={[styles.summaryCard, { borderLeftColor: '#FF9800' }]}
            onPress={() => navigation.navigate('Matches')}
          >
            <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="tennisball" size={20} color="#F57C00" />
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: '#F57C00' }]}>
                {formatNumber(resumen?.totalPartidos)}
              </Text>
              <Text style={styles.summaryLabel}>Partidos</Text>
            </View>
          </TouchableOpacity>

          {/* Rankings */}
          <View style={[styles.summaryCard, { borderLeftColor: '#4CAF50' }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="trophy" size={20} color="#388E3C" />
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: '#388E3C' }]}>
                {formatNumber(resumen?.totalRankings)}
              </Text>
              <Text style={styles.summaryLabel}>Rankings</Text>
            </View>
          </View>
        </View>


        {/* Sección: Actividad de Jugadores */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actividad de Jugadores</Text>

          <View style={styles.card}>
            <View style={styles.metricRow}>
              <View style={styles.metricDetail}>
                <Text style={styles.metricBigValue}>{formatPercentage(jugadores?.porcentajeConPartidos)}</Text>
                <Text style={styles.metricLabel}>Con Partidos</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.metricDetail}>
                <Text style={styles.metricBigValue}>{formatPercentage(jugadores?.porcentajeAfiliados)}</Text>
                <Text style={styles.metricLabel}>Afiliados</Text>
              </View>
            </View>

            {/* Categories Bar Chart (Simplified) */}
            {jugadores?.porCategoria && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.subLabel}>Distribución por Nivel</Text>
                <View style={styles.categoryBarContainer}>
                  {Object.entries(jugadores.porCategoria)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([nivel, count]) => (
                      <View key={nivel} style={{ flex: 1, alignItems: 'center' }}>
                        <View style={[styles.categoryBar, { height: Math.min(count * 5, 50) + 10 }]} />
                        <Text style={styles.categoryBarLabel}>{nivel}</Text>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Sección: Estado de Partidos */}
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionTitle}>Estado de Partidos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.progressRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={styles.progressLabel}>Activos</Text>
                  <Text style={styles.progressValue}>{formatPercentage(partidos?.porcentajeActivos)}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: formatPercentage(partidos?.porcentajeActivos), backgroundColor: '#2196F3' }]} />
                </View>
              </View>
            </View>

            <View style={[styles.progressRow, { marginTop: 16 }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={styles.progressLabel}>Finalizados</Text>
                  <Text style={styles.progressValue}>{formatPercentage(partidos?.porcentajeCompletos)}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: formatPercentage(partidos?.porcentajeCompletos), backgroundColor: '#4CAF50' }]} />
                </View>
              </View>
            </View>

            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.gray, fontSize: 12 }}>Total Activos: <Text style={{ fontWeight: '700', color: colors.dark }}>{partidos?.activos}</Text></Text>
              <Text style={{ color: colors.gray, fontSize: 12 }}>Total Finalizados: <Text style={{ fontWeight: '700', color: colors.dark }}>{partidos?.finalizados}</Text></Text>
            </View>
          </View>
        </View>

        {/* Sección: Cobertura (Geografía + Clubes) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cobertura</Text>
          <View style={styles.geoGrid}>
            <View style={styles.geoCard}>
              <Ionicons name="map-outline" size={24} color={colors.accent} />
              <Text style={styles.geoValue}>{geografia?.totalLocalidades || 0}</Text>
              <Text style={styles.geoLabel}>Localidades</Text>
            </View>
            <View style={styles.geoCard}>
              <Ionicons name="tennisball-outline" size={24} color={colors.orange} />
              <Text style={styles.geoValue}>{clubes?.totalCanchas || 0}</Text>
              <Text style={styles.geoLabel}>Canchas</Text>
            </View>
            <View style={styles.geoCard}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
              <Text style={styles.geoValue}>{clubes?.promedioJugadoresPorClub?.toFixed(0) || 0}</Text>
              <Text style={styles.geoLabel}>Jug/Club</Text>
            </View>
          </View>
        </View>

        {/* Timestamp */}
        {estadisticas?.timestamp && (
          <View style={styles.footer}>
            <Text style={styles.timestampText}>
              Actualizado: {new Date(estadisticas.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  headerGradient: {
    height: 100,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroSpacer: {
    height: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricDetail: {
    alignItems: 'center',
  },
  metricBigValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EFF0F1',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 10,
  },
  categoryBarContainer: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  categoryBar: {
    width: 6,
    backgroundColor: colors.orange,
    borderRadius: 3,
    marginBottom: 5,
  },
  categoryBarLabel: {
    fontSize: 10,
    color: colors.gray,
  },
  progressRow: {
    width: '100%',
  },
  progressLabel: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  geoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  geoCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  geoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginTop: 8,
    marginBottom: 2,
  },
  geoLabel: {
    fontSize: 11,
    color: colors.gray,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  timestampText: {
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  loadingText: {
    marginTop: 10,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 5,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});
