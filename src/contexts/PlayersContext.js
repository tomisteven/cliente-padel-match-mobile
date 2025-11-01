import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_URL, API_ROUTES } from "../utils/constants";

const PlayersContext = createContext();

const initialState = {
  players: [],
  loading: false,
  error: null,
  searchQuery: "",
  filters: {
    skill: null,
    location: null,
    sport: null,
  },
};

const playersReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PLAYERS":
      return { ...state, players: action.payload, loading: false, error: null };
    case "ADD_PLAYER":
      return { ...state, players: [...state.players, action.payload] };
    case "UPDATE_PLAYER":
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.payload.id
            ? { ...player, ...action.payload }
            : player
        ),
      };
    case "REMOVE_PLAYER":
      return {
        ...state,
        players: state.players.filter((player) => player.id !== action.payload),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const PlayersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playersReducer, initialState);
  const { token } = useUser();

  // Cargar jugadores al iniciar
  useEffect(() => {
    if (token) {
      loadPlayers();
    }
  }, [token]);

  const loadPlayers = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch(`${API_URL}${API_ROUTES.PLAYERS}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar jugadores");
      }

      const players = await response.json();
      dispatch({ type: "SET_PLAYERS", payload: players.jugadores });
    } catch (error) {
      console.error("Error loading players:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const searchPlayers = async (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(
        `https://api.sportmatch.com/players/search?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al buscar jugadores");
      }

      const players = await response.json();
      dispatch({ type: "SET_PLAYERS", payload: players });
    } catch (error) {
      console.error("Error searching players:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const getPlayerById = async (playerId) => {
    try {
      const response = await fetch(
        `https://api.sportmatch.com/players/${playerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener jugador");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting player:", error);
      throw error;
    }
  };

  const followPlayer = async (playerId) => {
    try {
      const response = await fetch(
        `https://api.sportmatch.com/players/${playerId}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al seguir jugador");
      }

      const updatedPlayer = await response.json();
      dispatch({ type: "UPDATE_PLAYER", payload: updatedPlayer });
      return updatedPlayer;
    } catch (error) {
      console.error("Error following player:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const unfollowPlayer = async (playerId) => {
    try {
      const response = await fetch(
        `https://api.sportmatch.com/players/${playerId}/unfollow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al dejar de seguir jugador");
      }

      const updatedPlayer = await response.json();
      dispatch({ type: "UPDATE_PLAYER", payload: updatedPlayer });
      return updatedPlayer;
    } catch (error) {
      console.error("Error unfollowing player:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const refreshPlayers = () => {
    loadPlayers();
  };

  const value = {
    ...state,
    searchPlayers,
    getPlayerById,
    followPlayer,
    unfollowPlayer,
    setFilters,
    refreshPlayers,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
