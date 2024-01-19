import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'
import * as jwt from 'jsonwebtoken';


const ChatContext = createContext();

export function ChatProvider ({ children }){
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [userID, setUserID] = useState(localStorage.getItem('userId') || null)
    const [logged  , setLogged] = useState(false)
    const [dataProfile, setDataProfile] = useState([])
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
      const fetchDataProfile = async() => {
        try {
          const response = await axios.get(`${apiUrl}user/profile`, {
            headers: {
              'Authorization': `Bearer: ${token}`
            }
          })
          setDataProfile(response.data.userProfile)
        } catch (error) {
          console.log(error);
        }
      }
      fetchDataProfile()
    }, [token])

    // Decodificar el token
    const decodedToken = jwt.decode(token);

    // Obtener la fecha de expiración del token en milisegundos
    const expirationTimeMillis = decodedToken.exp * 1000;

    // Obtener la fecha actual en milisegundos
    const currentTimeMillis = new Date().getTime();

    // Calcular el tiempo restante en milisegundos
    const timeRemainingMillis = expirationTimeMillis - currentTimeMillis;

    // Calcular el tiempo restante en segundos
    const timeRemainingSeconds = Math.floor(timeRemainingMillis / 1000);

    console.log('Tiempo restante para la expiración (en segundos):', timeRemainingSeconds);


    
  
  
    return (
      <ChatContext.Provider value={{ token, setToken, apiUrl, userID, setUserID, dataProfile, logged, setLogged}}>
        {children}
      </ChatContext.Provider>
    );
  };
  
  // Hook personalizado para acceder al contexto
export function chatAuth() {
    return useContext(ChatContext);
}


