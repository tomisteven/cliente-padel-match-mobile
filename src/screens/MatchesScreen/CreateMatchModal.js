import React from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de tener esta dependencia
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/global';
import { useCreateMatchLogic } from './hooks/useCreateMatchLogic';
import { styles } from './styles/CreateMatchModal.styles';

export default function CreateMatchModal({ visible, onClose, onMatchCreated }) {
    const {
        // States
        clubId,
        nombreClub,
        fecha,
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
    } = useCreateMatchLogic(onClose, onMatchCreated);

    return (
        <Modal
            visible={visible}
            animationType="slide" // Animación más fluida desde abajo
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Crear Nuevo Partido</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={30} color={colors.gray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>

                        {/* Selector de Club */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Club (Opcional)</Text>
                            <View style={styles.pickerContainer}>
                                {Platform.OS === 'android' && (
                                    <Ionicons name="business-outline" size={20} color={colors.gray} style={{ marginLeft: 10 }} />
                                )}
                                <Picker
                                    selectedValue={clubId}
                                    onValueChange={handleClubChange}
                                    style={styles.picker}
                                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                                >
                                    <Picker.Item label="Sin Club / Particular" value="" />
                                    {clubs && clubs.map((club) => (
                                        <Picker.Item key={club._id} label={club.nombreClub} value={club._id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Fecha y Hora Row */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Fecha</Text>
                                <TouchableOpacity
                                    style={styles.dateInput}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                                    <Text style={styles.dateText}>{formatDateForDisplay(fecha)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Hora (HH:MM)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={hora}
                                    onChangeText={setHora}
                                    placeholder="20:00"
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>

                        {/* Date Picker (Full Width, outside of row) */}
                        {showDatePicker && (
                            <View style={[styles.inputGroup, { marginBottom: 20 }]}>
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={fecha}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                        themeVariant="light"
                                    />
                                    {Platform.OS === 'ios' && (
                                        <TouchableOpacity
                                            style={styles.datePickerCloseButton}
                                            onPress={() => setShowDatePicker(false)}
                                        >
                                            <Text style={styles.datePickerCloseText}>Listo</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Cancha y Precio Row */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Cancha</Text>
                                <TextInput
                                    style={styles.input}
                                    value={cancha}
                                    onChangeText={setCancha}
                                    placeholder="Nro. o Nombre"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Precio ($)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={precio}
                                    onChangeText={setPrecio}
                                    placeholder="0"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Categoría y Jugadores Row */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Categoría (1-8)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={categoria}
                                    onChangeText={setCategoria}
                                    placeholder="7"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Jugadores Max.</Text>
                                <TextInput
                                    style={styles.input}
                                    value={jugadoresMaximos}
                                    onChangeText={setJugadoresMaximos}
                                    placeholder="4"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        {/* Ubicación Manual (si no hay club seleccionado) */}
                        {!clubId && (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Localidad</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={localidad}
                                        onChangeText={setLocalidad}
                                        placeholder="Ej: Palermo, Buenos Aires"
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Dirección</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={direccion}
                                        onChangeText={setDireccion}
                                        placeholder="Calle y Altura"
                                    />
                                </View>
                            </>
                        )}

                        {/* Descripción */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Descripción / Notas</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                placeholder="Detalles adicionales del partido..."
                                multiline={true}
                                numberOfLines={3}
                            />
                        </View>

                        <View style={{ height: 20 }} />

                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                            <Text style={styles.createButtonText}>Crear Partido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
