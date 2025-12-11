import React, { useRef } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/global';
import { useChatModalLogic } from './hooks/useChatModalLogic';
import { styles } from './styles/ChatModal.styles';

export default function ChatModal({ visible, partido, onClose }) {
    const {
        user,
        mensaje,
        setMensaje,
        scrollViewRef,
        mensajes,
        formatFecha,
        getInitials,
        isMyMessage,
        handleSend
    } = useChatModalLogic(visible, partido);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Chat del Partido</Text>
                        <Text style={styles.headerSubtitle}>
                            {partido?.nombre || 'Partido de Pádel'}
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        <Ionicons name="people" size={20} color={colors.white} />
                        <Text style={styles.participantsCount}>
                            {partido?.jugadores?.length || 0}
                        </Text>
                    </View>
                </View>

                {/* Mensajes */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {mensajes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubbles-outline" size={64} color={colors.gray} />
                            <Text style={styles.emptyText}>No hay mensajes aún</Text>
                            <Text style={styles.emptySubtext}>
                                Sé el primero en enviar un mensaje
                            </Text>
                        </View>
                    ) : (
                        mensajes.map((msg, index) => {
                            const isMine = isMyMessage(msg);
                            return (
                                <View
                                    key={index}
                                    style={[
                                        styles.messageWrapper,
                                        isMine ? styles.myMessageWrapper : styles.otherMessageWrapper,
                                    ]}
                                >
                                    {!isMine && (
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {getInitials(msg.nombreJugador)}
                                            </Text>
                                        </View>
                                    )}
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            isMine ? styles.myMessage : styles.otherMessage,
                                        ]}
                                    >
                                        {!isMine && (
                                            <Text style={styles.senderName}>{msg.nombreJugador}</Text>
                                        )}
                                        <Text style={styles.messageText}>{msg.mensaje}</Text>
                                        <Text
                                            style={[
                                                styles.messageTime,
                                                isMine ? styles.myMessageTime : styles.otherMessageTime,
                                            ]}
                                        >
                                            {formatFecha(msg.fecha)}
                                        </Text>
                                    </View>
                                    {isMine && <View style={styles.avatarSpacer} />}
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                {/* Input de Mensaje */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                value={mensaje}
                                onChangeText={setMensaje}
                                placeholder="Escribe un mensaje..."
                                placeholderTextColor={colors.gray}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    !mensaje.trim() && styles.sendButtonDisabled,
                                ]}
                                onPress={handleSend}
                                disabled={!mensaje.trim()}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={mensaje.trim() ? colors.white : colors.gray}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
