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
          match.id === action.payload.id
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

  console.log("Token:", token);

  // Cargar partidos al iniciar
  useEffect(() => {
    loadMatches();
  }, []);

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

      console.log("Matches:", matches);

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
        `https://api.sportmatch.com/matches/${matchId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al unirse al partido");
      }

      const updatedMatch = await response.json();
      dispatch({ type: "UPDATE_MATCH", payload: updatedMatch });
      return updatedMatch;
    } catch (error) {
      console.error("Error joining match:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const leaveMatch = async (matchId) => {
    try {
      const response = await fetch(
        `https://api.sportmatch.com/matches/${matchId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const refreshMatches = () => {
    loadMatches();
  };

  const value = {
    ...state,
    addMatch,
    joinMatch,
    leaveMatch,
    setFilters,
    refreshMatches,
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
