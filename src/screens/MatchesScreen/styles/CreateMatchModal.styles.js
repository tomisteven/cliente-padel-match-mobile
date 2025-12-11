import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography } from '../../../styles/global';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%', // Ocupa casi toda la pantalla
        paddingTop: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
    },
    closeButton: {
        padding: 5,
    },
    modalContent: {
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: colors.dark,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9', // Mantenemos el color de fondo original de CreateMatch pero estructura de EditMatch
        borderRadius: 12,
        paddingHorizontal: Platform.OS === 'ios' ? 0 : spacing.md,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                height: 180,
                justifyContent: 'center',
            },
            android: {
                minHeight: 50,
            },
        }),
    },
    picker: {
        flex: 1,
        width: '100%',
        ...Platform.select({
            ios: {
                height: 180,
                marginVertical: -40,
            },
            android: {
                height: 50,
            },
        }),
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    datePickerContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginTop: spacing.sm,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
    },
    datePickerCloseButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },
    datePickerCloseText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    cancelButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 16,
    },
    createButton: {
        flex: 2,
        padding: 15,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerItem: {
        fontSize: 16,
        height: 180,
        color: colors.dark,
    },
});
