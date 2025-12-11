import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_URL, API_ROUTES } from "../utils/constants";

const ClubsContext = createContext();

const initialState = {
  clubs: [],
  loading: false,
  error: null,
  searchQuery: "",
  filters: {
    location: null,
    sports: null,
    rating: null,
  },
};

const clubsReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CLUBS":
      return { ...state, clubs: action.payload, loading: false, error: null };
    case "ADD_CLUB":
      return { ...state, clubs: [...state.clubs, action.payload] };
    case "UPDATE_CLUB":
      return {
        ...state,
        clubs: state.clubs.map((club) =>
          club.id === action.payload.id ? { ...club, ...action.payload } : club
        ),
      };
    case "REMOVE_CLUB":
      return {
        ...state,
        clubs: state.clubs.filter((club) => club.id !== action.payload),
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

export const ClubsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(clubsReducer, initialState);
  const { token } = useUser(); // ✅ Obtener el token del UserContext

  // Cargar clubes al iniciar
  useEffect(() => {
    //console.log("cargando clubes al iniciar");
    loadClubs();
  }, []);

  const loadClubs = async () => {
    //console.log("cargando clubes");
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(`${API_URL}${API_ROUTES.CLUBS}`, {
        method: "GET", // ✅ Aquí va el método
        headers: {
          "Content-Type": "application/json",
          // Si tu API requiere autenticación, descomenta esto:
          Authorization: `${token}`,
        },
      });



      const clubs = await response.json();
      //console.log("clubes cargados:", clubs); // ✅ Para debugging
      dispatch({ type: "SET_CLUBS", payload: clubs });

    } catch (error) {
      console.error("Error loading clubs:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const searchClubs = async (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.CLUBS}?q=${query}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al buscar clubes");
      }

      const clubs = await response.json();
      dispatch({ type: "SET_CLUBS", payload: clubs });
    } catch (error) {
      console.error("Error searching clubs:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const getClubById = async (clubId) => {
    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.CLUBS}/${clubId}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener club");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting club:", error);
      throw error;
    }
  };

  const joinClub = async (clubId) => {
    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.CLUBS}/${clubId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al unirse al club");
      }

      const updatedClub = await response.json();
      dispatch({ type: "UPDATE_CLUB", payload: updatedClub });
      return updatedClub;
    } catch (error) {
      console.error("Error joining club:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const leaveClub = async (clubId) => {
    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.CLUBS}/${clubId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al salir del club");
      }

      const updatedClub = await response.json();
      dispatch({ type: "UPDATE_CLUB", payload: updatedClub });
      return updatedClub;
    } catch (error) {
      console.error("Error leaving club:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const rateClub = async (clubId, rating) => {
    try {
      const response = await fetch(
        `${API_URL}${API_ROUTES.CLUBS}/${clubId}/rate`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al calificar club");
      }

      const updatedClub = await response.json();
      dispatch({ type: "UPDATE_CLUB", payload: updatedClub });
      return updatedClub;
    } catch (error) {
      console.error("Error rating club:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const refreshClubs = () => {
    loadClubs();
  };

  const value = {
    ...state,
    searchClubs,
    getClubById,
    joinClub,
    leaveClub,
    rateClub,
    setFilters,
    refreshClubs,
  };

  return (
    <ClubsContext.Provider value={value}>{children}</ClubsContext.Provider>
  );
};

export const useClubs = () => {
  const context = useContext(ClubsContext);
  if (!context) {
    throw new Error("useClubs must be used within a ClubsProvider");
  }
  return context;
};