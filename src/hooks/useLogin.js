import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNotification } from "../contexts/NotificationContext";
import { API_URL, API_ROUTES } from "../utils/constants";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();
  const { showError, showSuccess, showWarning, showInfo } = useNotification();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      showWarning("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log(email, password);
      const response = await fetch(`${API_URL}${API_ROUTES.AUTH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión");
        showError(errorData.message || "Error al iniciar sesión");
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      //console.log("data", data);
      // Guardar token y datos del usuario
      await login(data.accessToken);

      showSuccess("¡Inicio de sesión exitoso!");

      // Cerrar el modal y voler a la app
    } catch (error) {
      console.error("Login error:", error);
      showError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Cuando tengas la pantalla de registro, descomenta:
    // navigation.navigate('Register');
    showInfo("La funcionalidad de registro estará disponible pronto");
  };

  const handleForgotPassword = () => {
    // Cuando tengas la pantalla de recuperar contraseña, descomenta:
    // navigation.navigate('ForgotPassword');
    showInfo("La funcionalidad de recuperación estará disponible pronto");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    // State
    email,
    password,
    loading,
    showPassword,
    error,

    // Setters
    setEmail,
    setPassword,

    // Handlers
    handleLogin,
    handleRegister,
    handleForgotPassword,
    togglePasswordVisibility,
  };
};
