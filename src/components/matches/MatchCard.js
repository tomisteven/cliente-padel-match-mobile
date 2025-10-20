import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { colors, typography, spacing } from '../../styles/global';

export default function MatchCard({ match, onJoin, onLike, onShare }) {
  const getSportIcon = (sport) => {
    const icons = {
      pádel: 'tennisball',
      tenis: 'tennisball',
      fútbol: 'football',
      baloncesto: 'basketball',
      voleibol: 'volleyball',
    };
    return icons[sport] || 'tennisball';
  };

  return (
    <Card style={styles.matchCard}>
      <View style={styles.cardHeader}>
        <View style={styles.matchInfo}>
          <View style={styles.matchIcon}>
            <Ionicons
              name={getSportIcon(match.sport)}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.matchDetails}>
            <Text style={styles.matchTitle}>{match.title}</Text>
            <Text style={styles.matchSubtitle}>
              {match.location} • {match.date}
            </Text>
          </View>
        </View>
        <View style={styles.sportBadge}>
          <Text style={styles.sportText}>{match.sport}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.matchDescription}>{match.description}</Text>
        <View style={styles.matchMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={16} color={colors.gray} />
            <Text style={styles.metaText}>
              {match.currentPlayers}/{match.maxPlayers} jugadores
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={16} color={colors.gray} />
            <Text style={styles.metaText}>{match.distance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
          <Text style={styles.joinButtonText}>Unirse</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onLike}>
            <Ionicons
              name={match.liked ? "heart" : "heart-outline"}
              size={24}
              color={match.liked ? colors.accent : colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <Ionicons name="share-social-outline" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  matchCard: {
    marginHorizontal: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  matchInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  matchIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.light,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  matchDetails: {
    flex: 1,
  },
  matchTitle: {
    ...typography.subtitle,
    marginBottom: 4,
  },
  matchSubtitle: {
    ...typography.caption,
  },
  sportBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: spacing.sm,
  },
  matchDescription: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  matchMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  metaText: {
    ...typography.caption,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
});