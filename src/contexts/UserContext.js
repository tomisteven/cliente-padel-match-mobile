import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, API_ROUTES } from "../utils/constants";

const UserContext = createContext();

const initialState = {
  user: {},
  token: "",
  isAuthenticated: false,
  loading: true,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Cargar datos del usuario al iniciar la app
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");

      if (token && userData) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            token,
            user: JSON.parse(userData),
          },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const getUser = await fetch(`${API_URL}${API_ROUTES.JUGADORES}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const userData = await getUser.json();

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: userData, token },
      });
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const login = async (token) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      const getUser = await fetch(`${API_URL}${API_ROUTES.JUGADORES}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const userData = await getUser.json();

      //console.log("userData", userData);

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: userData, token },
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error removing user data:", error);
    }
  };

  const updateUser = async (userData) => {
    try {
      /* console.log("actualizando usuario");
      console.log("userData", userData); */
      const token = await AsyncStorage.getItem("userToken");
      //console.log("token desde context", token);
      const response = await fetch(`${API_URL}${API_ROUTES.PLAYER}${API_ROUTES.UPDATE}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al actualizar el usuario');
      }

      const data = await response.json();
      //console.log("data actualizada", data);
      await AsyncStorage.setItem('userData', JSON.stringify(data.jugador));
      dispatch({ type: 'UPDATE_USER', payload: data.jugador });
    } catch (error) {
      console.error('Error updating user:', error);
    }

  };

  const crearPartido = async (partidoData) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      //console.log("Token desde context", token);

      const response = await fetch(`${API_URL}${API_ROUTES.PLAYER}${API_ROUTES.CREAR_PARTIDO}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(partidoData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al crear el partido');
      }

      const data = await response.json();
      //console.log("Partido creado exitosamente:", data);

      if (data.jugador) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.jugador));
        dispatch({ type: 'UPDATE_USER', payload: data.jugador });
      } else {
        // Si no viene el jugador actualizado, solo logueamos o hacemos un refresh si fuera necesario
        console.log("Partido creado, pero no se recibió data.jugador para actualizar el contexto.");
      }
    } catch (error) {
      console.error('Error creating partido:', error);
    }
  };

  const afiliarJugadorAClub = async ({ clubId }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      //console.log(`Afiliando a club: ${clubId}`);

      const response = await fetch(`${API_URL}${API_ROUTES.JUGADORES}${API_ROUTES.AFILIARSE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ club_id: clubId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al afiliarse al club');
      }

      const data = await response.json();
      //console.log("Afiliación exitosa:", data);

      // Recargar datos del usuario para actualizar la lista de clubes
      await loadUserData();

      return data;
    } catch (error) {
      console.error('Error en afiliación:', error);
      throw error;
    }
  };


  const desafiliarJugador = async ({ clubId }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      //console.log(`Desafiliando de club: ${clubId}`);

      const response = await fetch(`${API_URL}${API_ROUTES.JUGADORES}${API_ROUTES.DESAFILIARSE}/${clubId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        }
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al desafiliarse del club');
      }

      const data = await response.json();
      //console.log("Desafiliación exitosa:", data);

      // Recargar datos del usuario para actualizar la lista de clubes
      await loadUserData();

      return data;
    } catch (error) {
      console.error('Error en desafiliación:', error);
      throw error;
    }
  };

  const register = async ({ nombre, email, password, repeatPassword }) => {
    try {
      const response = await fetch(`${API_URL}${API_ROUTES.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password, repeatPassword }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error al registrar');
      }

      const data = await response.json();
      // Assuming the register endpoint returns token and user data similar to login
      await login(data.accessToken);
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    register,
    afiliarJugadorAClub,
    desafiliarJugador,
    loadUserData,
    refreshUserData,
    crearPartido,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
