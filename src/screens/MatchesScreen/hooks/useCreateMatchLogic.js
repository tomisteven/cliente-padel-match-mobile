import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useClubs } from '../../../contexts/ClubsContext';
import { useUser } from '../../../contexts/UserContext';
import { useNotification } from '../../../contexts/NotificationContext';

export const useCreateMatchLogic = (onClose, onMatchCreated) => {
    const { clubs } = useClubs();
    const { crearPartido } = useUser();
    // const { showSuccess, showError } = useNotification(); // Si se descomenta en el futuro

    // Estados del formulario
    const [clubId, setClubId] = useState('');
    const [nombreClub, setNombreClub] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hora, setHora] = useState('');
    const [cancha, setCancha] = useState('');
    const [categoria, setCategoria] = useState('7'); // Valor por defecto
    const [jugadoresMaximos, setJugadoresMaximos] = useState('4');
    const [precio, setPrecio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [direccion, setDireccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [latitud, setLatitud] = useState(0);
    const [longitud, setLongitud] = useState(0);

    // Helpers
    const formatDateForDisplay = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleClubChange = (selectedClubId) => {
        setClubId(selectedClubId);
        if (selectedClubId) {
            const selectedClub = clubs.find(c => c._id === selectedClubId);
            if (selectedClub) {
                setNombreClub(selectedClub.nombreClub);
                if (selectedClub.localidad) setLocalidad(selectedClub.localidad);
                if (selectedClub.direccion) setDireccion(selectedClub.direccion);
                if (selectedClub.coordenadas) {
                    setLatitud(selectedClub.coordenadas.x || selectedClub.coordenadas.lat);
                    setLongitud(selectedClub.coordenadas.y || selectedClub.coordenadas.lng);
                }
            }
        } else {
            // Limpiar si se deselecciona
            setNombreClub('');
            setLocalidad('');
            setDireccion('');
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFecha(selectedDate);
        }
    };

    const handleCreate = async () => {
        try {
            const newMatchData = {
                clubId: clubId || null, // Puede ser null si es "Sin Club"
                nombreClub: nombreClub.trim() || (clubId ? '' : 'Pista Particular'), // Valor por defecto si no hay club
                fecha: fecha.toISOString().split('T')[0],
                hora: hora.trim(),
                cancha: cancha.trim(),
                categoria: parseInt(categoria) || 7,
                jugadoresMaximos: parseInt(jugadoresMaximos) || 4,
                precio: parseFloat(precio) || 0,
                localidad: localidad.trim(),
                direccion: direccion.trim(),
                descripcion: descripcion.trim(),
                latitud,
                longitud,
                estado: 'disponible' // Estado inicial
            };

            await crearPartido(newMatchData);

            Alert.alert("Éxito", "Partido creado correctamente");

            if (onMatchCreated) onMatchCreated();
            handleClose(); // Cerrar y limpiar
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo crear el partido");
        }
    };

    const handleClose = () => {
        // Resetear form
        setClubId('');
        setNombreClub('');
        setFecha(new Date());
        setHora('');
        setCancha('');
        setCategoria('7');
        setJugadoresMaximos('4');
        setPrecio('');
        setLocalidad('');
        setDireccion('');
        setDescripcion('');
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
        jugadoresMaximos, setJugadoresMaximos,
        precio, setPrecio,
        localidad, setLocalidad,
        direccion, setDireccion,
        descripcion, setDescripcion,

        // Context Data
        clubs,

        // Handlers
        handleClubChange,
        onDateChange,
        handleCreate,
        handleClose,
        formatDateForDisplay
    };
};
