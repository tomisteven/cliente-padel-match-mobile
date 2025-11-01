import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../../styles/global";
import  { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.logo}>
          <Ionicons name="tennisball" size={24} color={colors.white} />
          <Text style={styles.logoText}>SportMatch</Text>
        </View>
        <View style={styles.userActions}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.white}
          />
          <Ionicons
            onPress={() => navigation.navigate("Login")}
            name="person-circle-outline"
            size={24}
            color={colors.white}
          />
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jugadores, partidos, clubes..."
          placeholderTextColor={colors.gray}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: spacing.xs,
  },
  userActions: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
  searchBar: {
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
});
