import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../styles/global';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        ...typography.subtitle,
        fontSize: 16,
        color: colors.white,
        fontWeight: '600',
    },
    headerSubtitle: {
        ...typography.caption,
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    participantsCount: {
        ...typography.caption,
        fontSize: 12,
        color: colors.white,
        fontWeight: '600',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: spacing.md,
        paddingBottom: spacing.lg,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl * 3,
    },
    emptyText: {
        ...typography.subtitle,
        fontSize: 18,
        color: colors.dark,
        marginTop: spacing.md,
        fontWeight: '600',
    },
    emptySubtext: {
        ...typography.caption,
        fontSize: 14,
        color: colors.gray,
        marginTop: spacing.xs,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        alignItems: 'flex-end',
    },
    myMessageWrapper: {
        justifyContent: 'flex-end',
    },
    otherMessageWrapper: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    avatarText: {
        ...typography.caption,
        fontSize: 14,
        color: colors.white,
        fontWeight: '600',
    },
    avatarSpacer: {
        width: 36,
    },
    messageBubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: spacing.md,
        shadowColor: colors.light,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    myMessage: {
        backgroundColor: colors.accent,
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: colors.gray,
        borderBottomLeftRadius: 4,
    },
    senderName: {
        ...typography.caption,
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    messageText: {
        ...typography.body,
        fontSize: 15,
        color: colors.light,
        lineHeight: 20,
    },
    messageTime: {
        ...typography.caption,
        fontSize: 11,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherMessageTime: {
        color: colors.gray,
    },
    inputContainer: {
        backgroundColor: colors.white,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f0f2f5',
        borderRadius: 24,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        gap: spacing.sm,
    },
    textInput: {
        flex: 1,
        ...typography.body,
        fontSize: 15,
        color: colors.dark,
        maxHeight: 100,
        paddingVertical: spacing.sm,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: '#e0e0e0',
    },
});
