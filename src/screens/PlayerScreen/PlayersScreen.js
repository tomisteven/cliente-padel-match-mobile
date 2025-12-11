import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayers } from '../../contexts/PlayersContext';
import { colors, typography, spacing } from '../../styles/global';
import { PlayerCard } from '../../components/generic';

import { LinearGradient } from 'expo-linear-gradient';

export default function PlayersScreen({ navigation }) {
  const { players, loading, refreshPlayers } = usePlayers();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPlayers();
    setRefreshing(false);
  };

  // Filtrar jugadores en tiempo real basado en la búsqueda
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return players;
    }

    const query = searchQuery.toLowerCase().trim();
    return players.filter((player) => {
      const nombreMatch = player.nombre?.toLowerCase().includes(query);
      const emailMatch = player.email?.toLowerCase().includes(query);
      const categoriaMatch = player.categoria?.toString().includes(query);
      const localidadMatch = player.localidad?.toLowerCase().includes(query);
      return nombreMatch || emailMatch || categoriaMatch || localidadMatch;
    });
  }, [searchQuery, players]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo Gradiente Sutil */}
      <LinearGradient
        colors={['#F0F4FF', '#FFFFFF', '#F0F4FF']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header Moderno con Gradiente Vibrante */}
      <LinearGradient
        colors={['#016b1fff', '#6dd5ed']} // Celeste vibrante
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Jugadores</Text>
          <Text style={styles.subtitle}>Encuentra tu compañero ideal</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.statBadge}>
            <Ionicons name="people" size={16} color={colors.white} />
            <Text style={styles.statText}>{players.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Barra de Búsqueda Flotante */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, nivel, zona..."
            placeholderTextColor="#90A4AE"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Resultados de Búsqueda */}
      {searchQuery.trim().length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.searchResultsText}>
            Encontrados: <Text style={{ fontWeight: '700', color: colors.primary }}>{filteredPlayers.length}</Text>
          </Text>
        </View>
      )}

      {/* Lista de Jugadores */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando jugadores...</Text>
          </View>
        ) : filteredPlayers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.emptyIconContainer}
            >
              <Ionicons name="people" size={50} color={colors.primary} />
            </LinearGradient>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Sin resultados' : 'Lista vacía'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No encontramos coincidencias para "${searchQuery}".`
                : 'Aún no hay jugadores registrados.'}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <LinearGradient
                  colors={[colors.primary, '#42A5F5']}
                  style={styles.clearSearchGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.clearSearchButtonText}>Ver todos los jugadores</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredPlayers.map((player, index) => (
            <PlayerCard
              key={player.id || player._id || index}
              player={player}
              onPress={(player) => navigation.navigate('PlayerProfile', { player })}
              onActionPress={(player) => navigation.navigate('PlayerProfile', { player })}
              actionIcon="chevron-forward-circle"

            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 30, // Increased for overlap
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
  },
  headerStats: {
    marginLeft: 15,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  searchSection: {
    marginTop: -25, // Overlap header
    paddingHorizontal: 20,
    paddingBottom: 5,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 12,
    shadowColor: "#2193b0", // Colored shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
    paddingVertical: 0,
    fontWeight: '500',
  },
  searchResults: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  searchResultsText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: colors.primary,
    marginTop: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 20,
    color: colors.dark,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontSize: 15,
  },
  clearSearchButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  clearSearchGradient: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
