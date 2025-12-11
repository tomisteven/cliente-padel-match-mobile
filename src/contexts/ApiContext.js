import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useUser } from "./UserContext";
import { API_URL, API_ROUTES } from "../utils/constants";


const ApiContext = createContext();

const initialState = {
    clubsIds: [],
    estadisticas: {},
    localidades: [],
    loading: false,
    error: null

}

const apiReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        case "SET_ESTADISTICAS":
            return { ...state, estadisticas: action.payload }
        case "REFRESH_ESTADISTICAS":
            return { ...state, estadisticas: {} }
        case "SET_ERROR":
            return { ...state, error: action.payload }
        case "SET_CLUBS_IDS":
            return { ...state, clubsIds: action.payload }
        case "SET_LOCALIDADES":
            return { ...state, localidades: action.payload }
        default:
            return state
    }
}

export const ApiProvider = ({ children }) => {
    const [state, dispatch] = useReducer(apiReducer, initialState);
    const { token } = useUser();


    useEffect(() => {
        //console.log("cargando estadisticas al iniciar");
        loadEstadisticas();
        loadLocalidades();
        //loadClubsIds();

    }, []);

    const loadEstadisticas = async () => {
        //console.log("cargando estadisticas");
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch(`${API_URL}${API_ROUTES.API}${API_ROUTES.ESTADISTICAS}`, {
                method: "GET", // ✅ Aquí va el método
                headers: {
                    "Content-Type": "application/json",
                    // Si tu API requiere autenticación, descomenta esto:
                    Authorization: `${token}`,
                },
            });

            if (!response) {
                throw new Error(`Error al cargar estadisticas: ${response.status}`);
            }

            const estadisticas = await response.json()
            dispatch({ type: "SET_ESTADISTICAS", payload: estadisticas });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
            console.error("Error loading estadisticas:", error);
            dispatch({ type: "SET_ERROR", payload: error.message });
        }
    };

    const loadLocalidades = async () => {
        //console.log("cargando localidades");
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch(`${API_URL}${API_ROUTES.API}${API_ROUTES.LOCALIDADES}`, {
                method: "GET", // ✅ Aquí va el método
                headers: {
                    "Content-Type": "application/json",
                    // Si tu API requiere autenticación, descomenta esto:
                    Authorization: `${token}`,
                },
            });

            if (!response) {
                throw new Error(`Error al cargar localidades: ${response.status}`);
            }

            const localidades = await response.json()
            //console.log("localidades desde api", localidades);

            dispatch({ type: "SET_LOCALIDADES", payload: localidades.localidades });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
            console.error("Error loading localidades:", error);
            dispatch({ type: "SET_ERROR", payload: error.message });
        }
    };

    const loadClubsIds = async () => {
        //console.log("cargando ids de clubes");
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const response = await fetch(`${API_URL}${API_ROUTES.API}${API_ROUTES.CLUBS_IDS}`, {
                method: "GET", // ✅ Aquí va el método
                headers: {
                    "Content-Type": "application/json",
                    // Si tu API requiere autenticación, descomenta esto:
                    Authorization: `${token}`,
                },
            });

            if (!response) {
                throw new Error(`Error al cargar ids de clubes: ${response.status}`);
            }

            const clubsIds = await response.json()
            //onsole.log("clubsIds desde api", clubsIds)
            dispatch({ type: "SET_CLUBS_IDS", payload: clubsIds });
            dispatch({ type: "SET_LOADING", payload: false });
        } catch (error) {
            console.error("Error loading clubs ids:", error);
            dispatch({ type: "SET_ERROR", payload: error.message });
        }
    };

    const refreshEstadisticas = () => {
        dispatch({ type: "REFRESH_ESTADISTICAS" });
    };

    const setEstadisticas = (estadisticas) => {
        dispatch({ type: "SET_ESTADISTICAS", payload: estadisticas });
    };

    const setError = (error) => {
        dispatch({ type: "SET_ERROR", payload: error });
    };

    return (
        <ApiContext.Provider value={{
            estadisticas: state.estadisticas,
            localidades: state.localidades,
            clubsIds: state.clubsIds,
            loading: state.loading,
            error: state.error,
            loadEstadisticas,
            loadLocalidades,
            loadClubsIds,
            refreshEstadisticas,
            setEstadisticas,
            setError
        }}>
            {children}
        </ApiContext.Provider>
    );
}

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
}


