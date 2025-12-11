import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../styles/global';
import { useNotification } from '../../contexts/NotificationContext';
import { useUser } from '../../contexts/UserContext';
import { API_URL } from '../../utils/constants';

const CATEGORIAS = [
    { label: 'Nivel 8 - Inicial', value: 8 },
    { label: 'Nivel 7 - Inicial / Principiante', value: 7 },
    { label: 'Nivel 6 - Juego Regular', value: 6 },
    { label: 'Nivel 5 - Juego Regular / Avanzado', value: 5 },
    { label: 'Nivel 4 - Juego Con Pocos Errores', value: 4 },
    { label: 'Nivel 3 - Habilitado AJPP', value: 3 },
    { label: 'Nivel 2 - Semi Profesional', value: 2 },
    { label: 'Nivel 1 - Profesional', value: 1 },
];

const POSICIONES = [
    { label: 'Derecha / Drive', value: 'derecha' },
    { label: 'Izquierda / Revez', value: 'izquierda' },
    { label: 'Ambas', value: 'ambas' },
    { label: 'Zurdo', value: 'zurdo' },
];

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const HORARIOS = ['Mañana', 'Mediodía', 'Tarde', 'Noche'];

export default function EditProfileModal({ visible, onClose }) {
    const { user, token, updateUser } = useUser();
    const { showSuccess, showError, showWarning } = useNotification();

    // Estados de los campos
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [años, setAños] = useState('');
    const [celular, setCelular] = useState('');
    const [provincia, setProvincia] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [categoria, setCategoria] = useState(0);
    const [posicionEnCancha, setPosicionEnCancha] = useState('');
    const [diasPreferidos, setDiasPreferidos] = useState([]);
    const [horariosPreferidos, setHorariosPreferidos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados para modales de selección
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const [showPosicionModal, setShowPosicionModal] = useState(false);

    // Cargar datos del usuario cuando se abre el modal
    useEffect(() => {
        if (visible && user) {
            setNombre(user.nombre || '');
            setEmail(user.email || '');
            setAños(user.años?.toString() || '');
            setCelular(user.celular || '');
            setProvincia(user.provincia || '');
            setLocalidad(user.localidad || '');
            setCategoria(user.categoria || 0);
            setPosicionEnCancha(user.posicionEnCancha || '');
            setDiasPreferidos(user.diasPreferidos || []);
            setHorariosPreferidos(user.horariosPreferidos || []);
        }
    }, [visible, user]);

    const toggleDia = (dia) => {
        setDiasPreferidos(prev =>
            prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
        );
    };

    const toggleHorario = (horario) => {
        setHorariosPreferidos(prev =>
            prev.includes(horario) ? prev.filter(h => h !== horario) : [...prev, horario]
        );
    };

    const handleSave = async () => {
        // Validaciones
        if (!nombre.trim()) {
            showWarning('El nombre es obligatorio');
            return;
        }
        if (!email.trim()) {
            showWarning('El email es obligatorio');
            return;
        }

        setLoading(true);
        try {
            const updatedData = {
                nombre: nombre.trim(),
                email: email.trim(),
                años: parseInt(años) || 0,
                celular: celular.trim(),
                provincia: provincia.trim(),
                localidad: localidad.trim(),
                categoria: parseInt(categoria) || 0,
                posicionEnCancha: posicionEnCancha,
                diasPreferidos: diasPreferidos,
                horariosPreferidos: horariosPreferidos,
            };

            const response = await fetch(`${API_URL}/jugador/actualizar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al actualizar perfil');
            }

            const data = await response.json();

            // Actualizar el contexto con los nuevos datos
            updateUser(updatedData);

            showSuccess('¡Perfil actualizado exitosamente!');
            onClose();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            showError(error.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        style={styles.saveButton}
                    >
                        <Text style={[styles.saveButtonText, loading && styles.saveButtonTextDisabled]}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Sección: Información personal */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Ionicons name="person" size={18} color={colors.primary} /> Información Personal
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={nombre}
                                    onChangeText={setNombre}
                                    placeholder="Ingresa tu nombre"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="correo@ejemplo.com"
                                    placeholderTextColor={colors.gray}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Edad</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="calendar-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={años}
                                    onChangeText={setAños}
                                    placeholder="Ej: 25"
                                    placeholderTextColor={colors.gray}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Celular</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={celular}
                                    onChangeText={setCelular}
                                    placeholder="Ej: +54 9 11 1234-5678"
                                    placeholderTextColor={colors.gray}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Sección: Ubicación */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Ionicons name="location" size={18} color={colors.primary} /> Ubicación
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Provincia</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="map-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={provincia}
                                    onChangeText={setProvincia}
                                    placeholder="Ej: Buenos Aires"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Localidad</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="business-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={localidad}
                                    onChangeText={setLocalidad}
                                    placeholder="Ej: CABA"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Sección: Información deportiva */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Ionicons name="tennisball" size={18} color={colors.primary} /> Información Deportiva
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Categoría</Text>
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => setShowCategoriaModal(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="trophy-outline" size={20} color={colors.gray} />
                                <Text style={styles.pickerText}>
                                    {categoria === 0
                                        ? 'Selecciona tu nivel'
                                        : CATEGORIAS.find(c => c.value === categoria)?.label || 'Selecciona tu nivel'
                                    }
                                </Text>
                                <Ionicons name="chevron-down" size={20} color={colors.gray} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Posición en cancha</Text>
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => setShowPosicionModal(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="locate-outline" size={20} color={colors.gray} />
                                <Text style={styles.pickerText}>
                                    {posicionEnCancha === ''
                                        ? 'Selecciona posición'
                                        : POSICIONES.find(p => p.value === posicionEnCancha)?.label || 'Selecciona posición'
                                    }
                                </Text>
                                <Ionicons name="chevron-down" size={20} color={colors.gray} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sección: Preferencias */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            <Ionicons name="heart" size={18} color={colors.primary} /> Preferencias de Juego
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Días preferidos</Text>
                            <View style={styles.chipsContainer}>
                                {DIAS_SEMANA.map(dia => (
                                    <TouchableOpacity
                                        key={dia}
                                        style={[
                                            styles.chip,
                                            diasPreferidos.includes(dia) && styles.chipSelected,
                                        ]}
                                        onPress={() => toggleDia(dia)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                diasPreferidos.includes(dia) && styles.chipTextSelected,
                                            ]}
                                        >
                                            {dia.slice(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Horarios preferidos</Text>
                            <View style={styles.chipsContainer}>
                                {HORARIOS.map(horario => (
                                    <TouchableOpacity
                                        key={horario}
                                        style={[
                                            styles.chip,
                                            horariosPreferidos.includes(horario) && styles.chipSelected,
                                        ]}
                                        onPress={() => toggleHorario(horario)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                horariosPreferidos.includes(horario) && styles.chipTextSelected,
                                            ]}
                                        >
                                            {horario}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Botón de guardar inferior */}
                    <TouchableOpacity
                        style={[styles.mainSaveButton, loading && styles.mainSaveButtonDisabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                        <Text style={styles.mainSaveButtonText}>
                            {loading ? 'Guardando cambios...' : 'Guardar Cambios'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal de selección de categoría */}
            <Modal
                visible={showCategoriaModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCategoriaModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoriaModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecciona tu nivel</Text>
                            <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                                <Ionicons name="close" size={24} color={colors.dark} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            {CATEGORIAS.map(cat => (
                                <TouchableOpacity
                                    key={cat.value}
                                    style={[
                                        styles.modalOption,
                                        categoria === cat.value && styles.modalOptionSelected
                                    ]}
                                    onPress={() => {
                                        setCategoria(cat.value);
                                        setShowCategoriaModal(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalOptionText,
                                        categoria === cat.value && styles.modalOptionTextSelected
                                    ]}>
                                        {cat.label}
                                    </Text>
                                    {categoria === cat.value && (
                                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal de selección de posición */}
            <Modal
                visible={showPosicionModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPosicionModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPosicionModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecciona tu posición</Text>
                            <TouchableOpacity onPress={() => setShowPosicionModal(false)}>
                                <Ionicons name="close" size={24} color={colors.dark} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalScroll}>
                            {POSICIONES.map(pos => (
                                <TouchableOpacity
                                    key={pos.value}
                                    style={[
                                        styles.modalOption,
                                        posicionEnCancha === pos.value && styles.modalOptionSelected
                                    ]}
                                    onPress={() => {
                                        setPosicionEnCancha(pos.value);
                                        setShowPosicionModal(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalOptionText,
                                        posicionEnCancha === pos.value && styles.modalOptionTextSelected
                                    ]}>
                                        {pos.label}
                                    </Text>
                                    {posicionEnCancha === pos.value && (
                                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    closeButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.title,
        color: colors.white,
        fontSize: 20,
        fontWeight: '700',
    },
    saveButton: {
        padding: spacing.xs,
    },
    saveButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonTextDisabled: {
        opacity: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.subtitle,
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    label: {
        ...typography.body,
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: spacing.xs,
    },
    required: {
        color: colors.accent,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.xs,
        gap: spacing.sm,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    input: {
        flex: 1,
        ...typography.body,
        fontSize: 15,
        color: colors.dark,
        paddingVertical: spacing.xs,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        height: 50,
    },
    picker: {
        flex: 1,
        color: colors.dark,
        height: 50,
    },
    pickerText: {
        flex: 1,
        ...typography.body,
        fontSize: 15,
        color: colors.dark,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.body,
        fontSize: 13,
        fontWeight: '600',
        color: colors.dark,
    },
    chipTextSelected: {
        color: colors.white,
    },
    mainSaveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        paddingVertical: spacing.lg,
        borderRadius: 16,
        gap: spacing.sm,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    mainSaveButtonDisabled: {
        opacity: 0.6,
    },
    mainSaveButtonText: {
        ...typography.body,
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    bottomSpacing: {
        height: spacing.xl * 2,
    },
    // Estilos para modales personalizados
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        ...typography.subtitle,
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
    },
    modalScroll: {
        maxHeight: 400,
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    modalOptionSelected: {
        backgroundColor: '#f0f7ff',
    },
    modalOptionText: {
        ...typography.body,
        fontSize: 16,
        color: colors.dark,
    },
    modalOptionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
});
