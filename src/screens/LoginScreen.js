import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../styles/global";
import { useLogin } from "../hooks/useLogin";
import { useUser } from "../contexts/UserContext";
import { useNotification } from "../contexts/NotificationContext";

export default function LoginScreen({ navigation }) {
  const {
    email,
    password,
    loading,
    showPassword,
    setEmail,
    setPassword,
    handleLogin,
    togglePasswordVisibility,
    error,
  } = useLogin();

  const { showSuccess, showError } = useNotification();
  const { register } = useUser();

  // Estados para el registro
  const [isRegister, setIsRegister] = React.useState(false);
  const [nombre, setNombre] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [registerLoading, setRegisterLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !repeatPassword) {
      showError('Completa todos los campos');
      return;
    }
    if (password !== repeatPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }

    setRegisterLoading(true);
    try {
      await register({ nombre, email, password, repeatPassword });
      showSuccess('¡Registro exitoso! Iniciando sesión...');
      setIsRegister(false);
      // Limpiar campos
      setName('');
      setRepeatPassword('');
    } catch (e) {
      showError(e.message || 'Error al registrar');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showError('La funcionalidad de recuperación estará disponible pronto');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="tennisball" size={48} color={colors.primary} />
            <Text style={styles.logoText}>SportMatch</Text>
          </View>
          <Text style={styles.subtitle}>
            {isRegister ? 'Crea tu cuenta' : 'Conecta con otros deportistas'}
          </Text>
        </View>

        <View style={styles.errorContainer}>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.form}>
          {/* Campo de nombre (solo en registro) */}
          {isRegister && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor={colors.gray}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* Campo de email */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.gray}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Campo de contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.gray}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={colors.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.gray}
              />
            </TouchableOpacity>
          </View>

          {/* Campo de repetir contraseña (solo en registro) */}
          {isRegister && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Repetir contraseña"
                placeholderTextColor={colors.gray}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          )}

          {/* Botón de olvidaste contraseña (solo en login) */}
          {!isRegister && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          )}

          {/* Botón principal */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (loading || registerLoading) && styles.loginButtonDisabled
            ]}
            onPress={isRegister ? handleRegister : handleLogin}
            disabled={loading || registerLoading}
          >
            <Text style={styles.loginButtonText}>
              {isRegister
                ? (registerLoading ? "Registrando..." : "Crear Cuenta")
                : (loading ? "Iniciando sesión..." : "Iniciar Sesión")
              }
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón de Google */}
          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color={colors.dark} />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          {/* Toggle entre login y registro */}
          <View style={styles.registerContainer}>
            {isRegister ? (
              <TouchableOpacity onPress={() => setIsRegister(false)}>
                <Text style={styles.registerText}>
                  ¿Ya tienes cuenta?{' '}
                  <Text style={styles.registerLink}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsRegister(true)}>
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{' '}
                  <Text style={styles.registerLink}>Regístrate</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl * 2,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logoText: {
    ...typography.title,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: "center",
    fontSize: 16,
  },
  errorContainer: {
    minHeight: 30,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.error,
    textAlign: "center",
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.dark,
  },
  eyeIcon: {
    padding: spacing.sm,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.gray,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: spacing.lg,
  },
  googleButtonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: spacing.sm,
  },
  registerContainer: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  registerText: {
    color: colors.gray,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});
