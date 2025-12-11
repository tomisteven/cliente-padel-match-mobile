import { StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../../styles/global";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.light,
    },
    filtersHeader: {
        backgroundColor: colors.white,
        paddingTop: spacing.sm, // Menos padding arriba
        paddingBottom: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        zIndex: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: 6, // Reducido
    },
    screenTitle: {
        ...typography.subtitle,
        fontSize: 16,
        color: colors.dark,
        fontWeight: '700',
    },
    scrollContainer: {
        flexGrow: 0,
    },
    categoriesScroll: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        gap: 8,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: colors.white,
        gap: 6,
    },
    categoryText: {
        fontSize: 12,
        color: colors.gray,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#f5f5f5',
        marginVertical: 4,
        width: '90%',
        alignSelf: 'center',
    },
    locationsScroll: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        gap: 8,
        marginBottom: 4, // Espacio al final del header
    },
    locationChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15, // Más redondito
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    locationChipActive: {
        backgroundColor: colors.dark,
    },
    locationText: {
        fontSize: 11,
        color: colors.gray,
        fontWeight: '500',
    },
    locationTextActive: {
        color: colors.white,
    },
    contentContainer: {
        flex: 1,
        padding: spacing.md,
    },
    loadingWrapper: {
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    loadingText: {
        marginTop: 8,
        color: colors.gray,
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        opacity: 0.7,
    },
    emptyText: {
        marginTop: 10,
        color: colors.gray,
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 100,
    },
});
