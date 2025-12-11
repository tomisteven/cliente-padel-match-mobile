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
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/global';
import NotificationBar from '../../components/common/NotificationBar';
import { useEditMatchLogic } from './hooks/useEditMatchLogic';
import { styles } from './styles/EditMatchModal.styles';

export default function EditMatchModal({ visible, partido, onClose }) {
    const {
        // States
        clubId,
        nombreClub,
        fecha,
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
    } = useEditMatchLogic(partido, onClose);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerContent}>
                            <Ionicons name="create" size={24} color={colors.primary} />
                            <Text style={styles.modalTitle}>Editar Partido</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCancel}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={28} color={colors.dark} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.modalContent}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* SECCIÓN: INFORMACIÓN DEL CLUB */}
                        <Text style={styles.sectionTitle}>Información del Club</Text>

                        {/* Selector de Club */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Club <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.pickerContainer}>
                                {Platform.OS === 'android' && (
                                    <Ionicons name="business-outline" size={20} color={colors.gray} />
                                )}
                                <Picker
                                    selectedValue={clubId}
                                    onValueChange={handleClubChange}
                                    style={styles.picker}
                                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                                >
                                    <Picker.Item label="Seleccionar club..." value="" />
                                    {clubs && Array.isArray(clubs) && clubs.map((club) => (
                                        <Picker.Item key={club._id} label={club.nombreClub} value={club._id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Cancha */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cancha</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="tennisball-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={cancha}
                                    onChangeText={setCancha}
                                    placeholder="Ej: Cancha 1"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>

                        {/* SECCIÓN: FECHA Y HORA */}
                        <Text style={styles.sectionTitle}>Fecha y Hora</Text>

                        {/* Fecha */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Fecha <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity
                                style={styles.inputContainer}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="calendar-outline" size={20} color={colors.gray} />
                                <Text style={styles.dateText}>
                                    {formatDateForDisplay(fecha)}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color={colors.gray} />
                            </TouchableOpacity>
                            {showDatePicker && (
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
                            )}
                            <Text style={styles.hint}>Selecciona la fecha del partido</Text>
                        </View>

                        {/* Hora */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Hora <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="time-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={hora}
                                    onChangeText={setHora}
                                    placeholder="Ej: 18:00"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                            <Text style={styles.hint}>Formato: HH:MM (24 horas)</Text>
                        </View>

                        {/* SECCIÓN: DETALLES DEL PARTIDO */}
                        <Text style={styles.sectionTitle}>Detalles del Partido</Text>

                        {/* Categoría */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Categoría</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="trophy-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={categoria}
                                    onChangeText={setCategoria}
                                    placeholder="1-10"
                                    keyboardType="numeric"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                            <Text style={styles.hint}>Nivel de 1 (principiante) a 10 (profesional)</Text>
                        </View>

                        {/* Estado */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Estado del Partido</Text>
                            <View style={styles.pickerContainer}>
                                {Platform.OS === 'android' && (
                                    <Ionicons name="flag-outline" size={20} color={colors.gray} />
                                )}
                                <Picker
                                    selectedValue={estado}
                                    onValueChange={setEstado}
                                    style={styles.picker}
                                    itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}
                                >
                                    <Picker.Item label="Disponible" value="disponible" />
                                    <Picker.Item label="Completo" value="completo" />
                                    <Picker.Item label="Cancelado" value="cancelado" />
                                    <Picker.Item label="Finalizado" value="finalizado" />
                                </Picker>
                            </View>
                        </View>

                        {/* Jugadores Máximos */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Jugadores Máximos</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="people-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={jugadoresMaximos}
                                    onChangeText={setJugadoresMaximos}
                                    placeholder="4"
                                    keyboardType="numeric"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                            <Text style={styles.hint}>Número máximo de jugadores permitidos</Text>
                        </View>

                        {/* SECCIÓN: UBICACIÓN */}
                        <Text style={styles.sectionTitle}>Ubicación</Text>

                        {/* Localidad */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Localidad</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={localidad}
                                    onChangeText={setLocalidad}
                                    placeholder="Ej: Buenos Aires"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>

                        {/* Dirección */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Dirección</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="map-outline" size={20} color={colors.gray} />
                                <TextInput
                                    style={styles.input}
                                    value={direccion}
                                    onChangeText={setDireccion}
                                    placeholder="Ej: Av. Corrientes 1234"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>
                        </View>

                        {/* SECCIÓN: DESCRIPCIÓN */}
                        <Text style={styles.sectionTitle}>Descripción</Text>

                        {/* Descripción */}
                        <View style={styles.inputGroup}>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="document-text-outline" size={20} color={colors.gray} style={styles.textAreaIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={descripcion}
                                    onChangeText={setDescripcion}
                                    placeholder="Describe el partido, nivel requerido, etc."
                                    placeholderTextColor={colors.gray}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            activeOpacity={0.8}

                        >
                            <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* NotificationBar dentro del Modal */}
                <NotificationBar />
            </KeyboardAvoidingView>
        </Modal>
    );
}
