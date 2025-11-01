import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayers } from '../contexts/PlayersContext';
import { colors, typography, spacing } from '../styles/global';

export default function PlayersScreen() {
  const { players, loading, searchPlayers, followPlayer, unfollowPlayer } = usePlayers();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchPlayers(query);
    }
  };

  const handleFollow = async (playerId) => {
    try {
      await followPlayer(playerId);
    } catch (error) {
      console.error('Error following player:', error);
    }
  };

  const handleUnfollow = async (playerId) => {
    try {
      await unfollowPlayer(playerId);
    } catch (error) {
      console.error('Error unfollowing player:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Jugadores</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jugadores..."
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando jugadores...</Text>
          </View>
        ) : players.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.gray} />
            <Text style={styles.emptyText}>No hay jugadores disponibles</Text>
          </View>
        ) : (
          players.map((player) => (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerSkill}>Nivel: {player.skill}</Text>
                <Text style={styles.playerLocation}>{player.location}</Text>
              </View>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => player.isFollowing ? handleUnfollow(player.id) : handleFollow(player.id)}
              >
                <Text style={styles.followButtonText}>
                  {player.isFollowing ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    ...typography.title,
    color: colors.dark,
  },
  filterButton: {
    padding: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.dark,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.md,
  },
  playerCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    ...typography.subtitle,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  playerSkill: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  playerLocation: {
    ...typography.caption,
    color: colors.gray,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  followButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});
