import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/global";
import PartidoCard from "../../components/generic/PartidoCard";
import CreateMatchModal from "./CreateMatchModal";

// Imports Refactorizados
import { useMatchesLogic } from "./hooks/useMatchesLogic";
import { styles } from "./styles/MatchesScreen.styles";

export default function MatchesScreen({ navigation }) {
  const {
    showCreateModal,
    setShowCreateModal,
    refreshing,
    activeCategory,
    setActiveCategory,
    displayMatches,
    localLoading,
    contextLoading,
    localidades,
    MATCH_CATEGORIES,
    onRefresh,
    handleJoinMatch,
    handleLeaveMatch,
    handleDetailsPress,
    isUserInMatch
  } = useMatchesLogic(navigation);

  // ============================================================================
  // RENDER UI HELPERS
  // ============================================================================
  const renderMatchesList = () => {
    if (localLoading || (contextLoading && !refreshing)) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      );
    }

    if (displayMatches.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="tennisball-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyText}>No se encontraron partidos</Text>
        </View>
      );
    }

    return displayMatches.map((match, index) => {
      const isUserJoined = isUserInMatch(match);
      return (
        <PartidoCard
          key={match._id || index}
          partido={match}
          index={index}
          onPress={() => handleDetailsPress(match)}
          estaAfiliado={isUserJoined}
          onJoin={handleJoinMatch}
          onLeave={handleLeaveMatch}
          onDetailsPress={handleDetailsPress}
          isSelected={isUserJoined}

          onRefresh={onRefresh}
        />
      );
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* HEADER COMPACTO CON FILTROS */}
      <View style={styles.filtersHeader}>
        {/* Fila 1: Título pequeño + Botón Refresh */}
        <View style={styles.topRow}>
          <Text style={styles.screenTitle}>Partidos ({displayMatches.length})</Text>
          <TouchableOpacity onPress={onRefresh} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Fila 2: Categorías (Chips compactos) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          style={styles.scrollContainer}
        >
          {MATCH_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                activeCategory === cat.id && { backgroundColor: cat.color + '15', borderColor: cat.color }
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={activeCategory === cat.id ? cat.color : colors.gray}
              />
              <Text style={[
                styles.categoryText,
                activeCategory === cat.id && { color: cat.color, fontWeight: '700' }
              ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Separador sutil */}
        <View style={styles.separator} />

        {/* Fila 3: Localidades (Scroll horizontal) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.locationsScroll}
          style={styles.scrollContainer}
        >
          <View style={[styles.locationChip, styles.locationChipActive]}>
            <Text style={[styles.locationText, styles.locationTextActive]}>Todas</Text>
          </View>
          {localidades && localidades.map((loc, idx) => (
            <View key={idx} style={styles.locationChip}>
              <Text style={styles.locationText}>
                {loc.nombre || loc.localidad || loc}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderMatchesList()}
      </ScrollView>

      {/* FAB para crear partido */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      {/* Modal de Creación */}
      <CreateMatchModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onMatchCreated={() => {
          onRefresh();
          setShowCreateModal(false);
        }}
      />
    </View>
  );
}
