import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("tokenChat") || null);
  const [userID, setUserID] = useState(
    localStorage.getItem("userIdChat") || null
  );
  const [logged, setLogged] = useState(
    localStorage.getItem("loggedChat") || false
  );
  const [dataProfile, setDataProfile] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDataProfile = async () => {
      try {
        if(logged){
          const response = await axios.get(`${apiUrl}user/profile`, {
            headers: {
              Authorization: `Bearer: ${token}`,
            },
          });
          setDataProfile(response.data.userProfile);
        }
      } catch (error) {
        console.log(error);
        // Si la respuesta indica un token inválido o expirado
        if (error.response && error.response.status === 401) {
          // Limpiar localStorage y restablecer el estado
          localStorage.removeItem("tokenChat");
          localStorage.removeItem("userIdChat");
          localStorage.removeItem("loggedChat");
          setToken(null);
          setUserID(null);
          setLogged(false);
        }
      }
    };
    fetchDataProfile();
  }, [token, updateData]);


  return (
    <ChatContext.Provider
      value={{
        token,
        setToken,
        apiUrl,
        userID,
        setUserID,
        dataProfile,
        logged,
        setLogged,
        updateData,
        setUpdateData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function chatAuth() {
  return useContext(ChatContext);
}
