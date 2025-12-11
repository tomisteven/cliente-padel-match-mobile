import { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import { useUser } from '../../../contexts/UserContext';
import { useMatches } from '../../../contexts/MatchesContext';

export const useChatModalLogic = (visible, partido) => {
    const { showSuccess, showError } = useNotification();
    const { user } = useUser();
    const { enviarMensajeMatch, refreshMatches } = useMatches();
    const [mensaje, setMensaje] = useState('');
    const scrollViewRef = useRef(null);

    // Cargar mensajes al abrir el modal
    useEffect(() => {
        if (visible) {
            refreshMatches();
        }
    }, [visible]);

    // Scroll automático al último mensaje
    useEffect(() => {
        if (visible && scrollViewRef.current && partido?.mensajes) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [visible, partido?.mensajes]);

    // Helpers
    const formatFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes}m`;
        if (hours < 24) return `Hace ${hours}h`;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month} ${hour}:${min}`;
    };

    const getInitials = (nombre) => {
        if (!nombre) return '?';
        const words = nombre.trim().split(' ');
        if (words.length === 1) return words[0][0].toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const isMyMessage = (mensajeItem) => {
        return mensajeItem.jugadorId === user._id ||
            mensajeItem.jugadorId === user.id ||
            mensajeItem.nombreJugador === user.nombre ||
            mensajeItem.nombreJugador === user.name;
    };

    // Handlers
    const handleSend = async () => {
        console.log("Enviando mensaje:", mensaje);
        try {
            console.log("Enviando mensaje:", partido._id);
            const enviar = await enviarMensajeMatch(partido._id, mensaje);

            if (enviar.ok) {
                showSuccess('Mensaje enviado');
                // Optimistic UI update could go here if needed, but we rely on refetching usually or context update
                // Since this uses the context function that might not update local state immediately within the modal unless refreshed
                // We'll trust the context/socket/refresh logic. 
                // However, the original code mutated the prop directly: partido.mensajes.push(...) which is risky but I will faithfully reproduce the logic, though preferably safer.

                if (enviar.mensaje) {
                    // Safe update if partido is mutable or we just rely on parent re-render
                    if (partido.mensajes) {
                        partido.mensajes.push({
                            _id: enviar.mensaje._id,
                            fecha: enviar.mensaje.fecha,
                            jugadorId: enviar.mensaje.jugadorId,
                            mensaje: enviar.mensaje.mensaje,
                            nombreJugador: enviar.mensaje.nombreJugador,
                        });
                    }
                }
            } else {
                showError('Error al enviar el mensaje');
            }

            setMensaje('');

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            showError('Error al enviar el mensaje');
            console.error('Error sending message:', error);
        }
    };

    return {
        user,
        mensaje,
        setMensaje,
        scrollViewRef,
        mensajes: partido?.mensajes || [],
        formatFecha,
        getInitials,
        isMyMessage,
        handleSend
    };
};
