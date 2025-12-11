import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNotification } from '../../../contexts/NotificationContext';
import { useClubs } from '../../../contexts/ClubsContext';
import { useMatches } from '../../../contexts/MatchesContext';

export const useEditMatchLogic = (partido, onClose) => {
    const { showSuccess, showError } = useNotification();
    const { clubs } = useClubs();
    const { editMatch } = useMatches();

    // Estados para los campos editables
    const [clubId, setClubId] = useState(partido?.clubId || '');
    const [nombreClub, setNombreClub] = useState(partido?.nombreClub || '');
    const [fecha, setFecha] = useState(partido?.fecha ? new Date(partido.fecha) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hora, setHora] = useState(partido?.hora || '');
    const [cancha, setCancha] = useState(partido?.cancha || '');
    const [categoria, setCategoria] = useState(partido?.categoria?.toString() || '7');
    const [estado, setEstado] = useState(partido?.estado || 'disponible');
    const [localidad, setLocalidad] = useState(partido?.localidad || '');
    const [direccion, setDireccion] = useState(partido?.direccion || '');
    const [descripcion, setDescripcion] = useState(partido?.descripcion || '');
    const [jugadoresMaximos, setJugadoresMaximos] = useState(partido?.jugadoresMaximos?.toString() || '4');
    const [latitud, setLatitud] = useState(partido?.latitud || 0);
    const [longitud, setLongitud] = useState(partido?.longitud || 0);

    // Actualizar estados cuando cambia el partido
    useEffect(() => {
        if (partido) {
            setClubId(partido.clubId || '');
            setNombreClub(partido.nombreClub || '');
            setFecha(partido.fecha ? new Date(partido.fecha) : new Date());
            setHora(partido.hora || '');
            setCancha(partido.cancha || '');
            setCategoria(partido.categoria?.toString() || '7');
            setEstado(partido.estado || 'disponible');
            setLocalidad(partido.localidad || '');
            setDireccion(partido.direccion || '');
            setDescripcion(partido.descripcion || '');
            setJugadoresMaximos(partido.jugadoresMaximos?.toString() || '4');
        }
    }, [partido]);

    // Helpers
    const formatDateForDisplay = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Handlers
    const handleClubChange = (selectedClubId) => {
        setClubId(selectedClubId);
        const selectedClub = clubs.find(c => c._id === selectedClubId);
        if (selectedClub) {
            setNombreClub(selectedClub.nombreClub);
            // Opcionalmente, autocompletar localidad y dirección del club
            if (selectedClub.localidad) setLocalidad(selectedClub.localidad);
            if (selectedClub.direccion) setDireccion(selectedClub.direccion);
            if (selectedClub.coordenadas) {
                setLatitud(selectedClub.coordenadas.x);
                setLongitud(selectedClub.coordenadas.y);
            }
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios'); // En iOS mantener abierto, en Android cerrar
        if (selectedDate) {
            setFecha(selectedDate);
        }
    };

    const handleSave = async () => {
        try {
            const updatedMatch = {
                ...partido,
                clubId: clubId,
                nombreClub: nombreClub.trim(),
                fecha: fecha.toISOString().split('T')[0], // Convertir Date a formato YYYY-MM-DD
                hora: hora.trim(),
                cancha: cancha.trim(),
                categoria: parseInt(categoria) || 7,
                estado: estado,
                localidad: localidad.trim(),
                direccion: direccion.trim(),
                descripcion: descripcion.trim(),
                jugadoresMaximos: parseInt(jugadoresMaximos) || 4,
            };

            // Esperar a que se complete la actualización
            await editMatch(partido._id, updatedMatch);

            showSuccess('Cambios guardados exitosamente');
            onClose();
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            showError('Error al guardar los cambios. Intenta nuevamente.');
        }
    };

    const handleCancel = () => {
        // Restaurar valores originales
        if (partido) {
            setClubId(partido.clubId || '');
            setNombreClub(partido.nombreClub || '');
            setFecha(partido.fecha ? new Date(partido.fecha) : new Date());
            setHora(partido.hora || '');
            setCancha(partido.cancha || '');
            setCategoria(partido.categoria?.toString() || '7');
            setEstado(partido.estado || 'disponible');
            setLocalidad(partido.localidad || '');
            setDireccion(partido.direccion || '');
            setDescripcion(partido.descripcion || '');
            setJugadoresMaximos(partido.jugadoresMaximos?.toString() || '4');
        }
        onClose();
    };

    return {
        // States
        clubId, setClubId,
        nombreClub, setNombreClub,
        fecha, setFecha,
        showDatePicker, setShowDatePicker,
        hora, setHora,
        cancha, setCancha,
        categoria, setCategoria,
        estado, setEstado,
        localidad, setLocalidad,
        direccion, setDireccion,
        descripcion, setDescripcion,
        jugadoresMaximos, setJugadoresMaximos,

        // Context Data
        clubs,

        // Helpers
        formatDateForDisplay,

        // Handlers
        handleClubChange,
        onDateChange,
        handleSave,
        handleCancel
    };
};
