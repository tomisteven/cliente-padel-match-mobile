import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../../../styles/global';

// ========================================
// EJEMPLO: Pantalla de Partidos del Club
// ========================================
// Esta pantalla muestra todos los partidos de un club específico
// Se accede desde ClubDetailScreen
// 
// RECIBE: { club } desde route.params
// NAVEGA A: MatchDetail (cuando tocas un partido)
// ========================================

export default function ClubMatchesScreen({ route, navigation }) {
  // ========================================
  // OBTENER DATOS DE LA NAVEGACIÓN
  // ========================================
  // Los datos vienen desde la pantalla anterior vía navigation.navigate()
  const { club } = route.params;

  // ========================================
  // DATOS DE EJEMPLO
  // ========================================
  // En una app real, harías un fetch a tu API aquí
  const partidosActivos = club.partidosActivos || [];

  // ========================================
  // FUNCIONES DE NAVEGACIÓN
  // ========================================
  
  // Volver a la pantalla anterior (ClubDetail)
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Navegar a los detalles de un partido específico
  const handleMatchPress = (match) => {
    // Aquí navegarías a MatchDetail si existiera
    // navigation.navigate("MatchDetail", { match });
    console.log("Ver partido:", match);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <SafeAreaView style={styles.container}>
      {/* ====================================
          HEADER INTERNO (no el Header fijo)
          ==================================== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* ====================================
          CONTENIDO PRINCIPAL
          ==================================== */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Título de la pantalla */}
        <Text style={styles.title}>
          Partidos de {club.nombreClub}
        </Text>

        <Text style={styles.subtitle}>
          {partidosActivos.length} partidos activos
        </Text>

        {/* Lista de partidos */}
        <View style={styles.matchesList}>
          {partidosActivos.length === 0 ? (
            // Mensaje cuando no hay partidos
            <View style={styles.emptyState}>
              <Ionicons
                name="tennisball-outline"
                size={64}
                color={colors.gray}
              />
              <Text style={styles.emptyText}>
                No hay partidos activos en este club
              </Text>
            </View>
          ) : (
            // Lista de partidos
            partidosActivos.map((partido, index) => (
              <TouchableOpacity
                key={partido._id || index}
                style={styles.matchCard}
                onPress={() => handleMatchPress(partido)}
              >
                <View style={styles.matchHeader}>
                  <Ionicons
                    name="tennisball"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.matchDate}>
                    Partido {index + 1}
                  </Text>
                </View>

                <View style={styles.matchInfo}>
                  <Text style={styles.matchLabel}>Estado:</Text>
                  <Text style={styles.matchValue}>Activo</Text>
                </View>

                <View style={styles.matchFooter}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Botón para crear nuevo partido (opcional) */}
        {partidosActivos.length > 0 && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => console.log("Crear partido")}
          >
            <Ionicons name="add-circle" size={24} color={colors.white} />
            <Text style={styles.createButtonText}>
              Crear Nuevo Partido
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================
// ESTILOS
// ========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  
  // Header interno
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },

  // Contenido
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.title,
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    marginBottom: spacing.xl,
  },

  // Lista de partidos
  matchesList: {
    gap: spacing.md,
  },
  matchCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  matchDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.dark,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  matchLabel: {
    ...typography.caption,
    color: colors.gray,
  },
  matchValue: {
    ...typography.body,
    fontWeight: '500',
    color: colors.dark,
  },
  matchFooter: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },

  // Estado vacío
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  // Botón crear
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 16,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  createButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
