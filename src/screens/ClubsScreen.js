import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useClubs } from '../contexts/ClubsContext';
import { colors, typography } from '../styles/global';

export default function ClubsScreen() {
  const { clubs, loading } = useClubs();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clubes</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Pantalla de Clubes en desarrollo...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    ...typography.title,
    color: colors.dark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    ...typography.body,
    color: colors.gray,
  },
});
