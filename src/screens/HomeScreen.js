import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Header from '../components/common/Header';
import MatchCard from '../components/matches/MatchCard';
import { colors, typography, spacing } from '../styles/global';

// Datos de ejemplo
const mockMatches = [
  {
    id: '1',
    sport: 'pádel',
    title: 'Pádel - Nivel Intermedio',
    location: 'Club Deportivo Central',
    date: 'Hoy, 18:30',
    description: 'Se necesitan 2 jugadores para completar el partido. Cancha de cristal.',
    currentPlayers: 2,
    maxPlayers: 4,
    distance: '1.2 km',
    liked: false,
  },
  {
    id: '2',
    sport: 'fútbol',
    title: 'Fútbol 7 - Amistoso',
    location: 'Polideportivo Municipal',
    date: 'Mañana, 20:00',
    description: 'Partido amistoso, todos los niveles son bienvenidos.',
    currentPlayers: 5,
    maxPlayers: 14,
    distance: '2.5 km',
    liked: true,
  },
];

export default function HomeScreen() {
  const [matches, setMatches] = useState(mockMatches);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleJoinMatch = (matchId) => {
    console.log('Unirse al partido:', matchId);
    // Lógica para unirse al partido
  };

  const handleLikeMatch = (matchId) => {
    setMatches(matches.map(match =>
      match.id === matchId
        ? { ...match, liked: !match.liked }
        : match
    ));
  };

  const handleShareMatch = (matchId) => {
    console.log('Compartir partido:', matchId);
    // Lógica para compartir
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Partidos Activos</Text>
            <Text style={styles.seeAll}>Ver todos</Text>
          </View>

          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onJoin={() => handleJoinMatch(match.id)}
              onLike={() => handleLikeMatch(match.id)}
              onShare={() => handleShareMatch(match.id)}
            />
          ))}
        </View>

        {/* Secciones adicionales pueden ir aquí */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontSize: 20,
  },
  seeAll: {
    color: colors.secondary,
    fontWeight: '500',
  },
});