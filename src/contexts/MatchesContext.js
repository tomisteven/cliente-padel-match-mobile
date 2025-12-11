import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_URL, API_ROUTES } from "../utils/constants";

const MatchesContext = createContext();

const initialState = {
  matches: [],
  loading: false,
  error: null,
  filters: {
    sport: null,
    location: null,
    date: null,
  },
};

const matchesReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_MATCHES":
      return { ...state, matches: action.payload, loading: false, error: null };
    case "ADD_MATCH":
      return { ...state, matches: [...state.matches, action.payload] };
    case "UPDATE_MATCH":
      return {
        ...state,
        matches: state.matches.map((match) =>
          match._id === action.payload._id
            ? { ...match, ...action.payload }
            : match
        ),
      };
    case "REMOVE_MATCH":
      return {
        ...state,
        matches: state.matches.filter((match) => match.id !== action.payload),
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const MatchesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(matchesReducer, initialState);
  const { token } = useUser();

  //console.log("Token:", token);

  // Cargar partidos al iniciar
  useEffect(() => {
    loadMatches();
  }, []);

  const enviarMensajeMatch = async (matchId, mensaje) => {
    try {
      //console.log(`${API_URL}${API_ROUTES.MESSAGES}${API_ROUTES.MATCH}/${matchId}`);
      const response = await fetch(
        `${API_URL}${API_ROUTES.MESSAGES}${API_ROUTES.MATCH}/${matchId}`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mensaje }),
        }
      );

      /* if (!response.ok) {
        throw new Error("Error al enviar mensaje");
      } */



      const data = await response.json();

      dispatch({ type: "UPDATE_MATCH", payload: { id: matchId, mensajes: [...state.matches.find((match) => match._id === matchId).mensajes, data.mensaje] } });

      //console.log("Mensaje enviado:", data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const loadMatches = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_URL}${API_ROUTES.MATCHES}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar partidos");
      }

      const matches = await response.json();

      //console.log("Matches:", matches);

      dispatch({ type: "SET_MATCHES", payload: matches.partidos });
    } catch (error) {
      console.error("Error loading matches:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const addMatch = async (matchData) => {
    try {
      const response = await fetch("https://api.sportmatch.com/matches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error("Error al crear partido");
      }

      const newMatch = await response.json();
      dispatch({ type: "ADD_MATCH", payload: newMatch });
      return newMatch;
    } catch (error) {
      console.error("Error creating match:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const joinMatch = async (matchId) => {
    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.PLAYER}${API_ROUTES.JOIN}/${matchId}`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedMatch = await response.json();
      loadMatches();

      return updatedMatch;
    } catch (error) {
      console.error("Error joining match:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const leaveMatch = async (matchId) => {
    try {
      console.log("Leave match:", matchId);
      const response = await fetch(
        `${API_URL}${API_ROUTES.PLAYER}${API_ROUTES.SALIR_PARTIDO}/${matchId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al salir del partido");
      }

      const updatedMatch = await response.json();
      dispatch({ type: "UPDATE_MATCH", payload: updatedMatch });
      return updatedMatch;
    } catch (error) {
      console.error("Error leaving match:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const editMatch = async (matchId, matchData) => {
    try {
      //console.log('Editando partido:', matchId, matchData);

      const response = await fetch(
        `${API_URL}${API_ROUTES.MATCHES}/${matchId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al editar partido");
      }

      const updatedMatch = await response.json();
      //console.log('Partido actualizado desde API:', updatedMatch);

      // Recargar todos los partidos para asegurar sincronización
      await loadMatches();

      return updatedMatch;
    } catch (error) {
      console.error("Error editing match:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const refreshMatches = () => {
    loadMatches();
  };

  const filterMatches = async (queryParams) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_URL}${API_ROUTES.MATCHES}?${queryString}`, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al filtrar partidos");
      }

      const data = await response.json();
      return data.partidos || data; // Adaptar según la respuesta del back
    } catch (error) {
      console.error("Error filtering matches:", error);
      throw error;
    }
  };

  const value = {
    ...state,
    addMatch,
    joinMatch,
    leaveMatch,
    setFilters,
    refreshMatches,
    filterMatches,
    enviarMensajeMatch,
    editMatch
  };

  return (
    <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
