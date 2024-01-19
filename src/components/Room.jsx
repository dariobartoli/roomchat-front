import {useState, useEffect, useRef } from 'react'
import { chatAuth } from '../context/chatContext'
import axios from 'axios'
import io from 'socket.io-client';
import { useParams } from "react-router-dom";
import styles from '../styles/Room.module.css'
import { NavLink } from 'react-router-dom';


const Room = () => {
    const [roomData, setRoomData] = useState([])
    const [messages, setMessages] = useState([]);
    const {token, apiUrl, userID, dataProfile} = chatAuth()
    const [newMessage, setNewMessage] = useState('')
    const { id } = useParams();
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const fetchRoomData = async() => {
            try {
                const response = await axios.get(`${apiUrl}room/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setRoomData(response.data.room)
                let messageSchema = []
                console.log(response.data.room);
                response.data.room.history.forEach(element => {
                    let date = element.createdAt.split('T')
                    let hour = date[1].split('.')
                    let hour2 = hour[0].split(':')
                    let hourFix
                    if(hour2[0] === "00"){
                        hourFix = 21
                    }else if(hour2[0] === "01"){
                        hourFix = 22
                    }else if( hour2[0] === "02" ){
                        hourFix = 23
                    }else{
                        hourFix = hour2[0] - 3
                    }
                    let hour3 = hourFix + ":"+hour2[1]
                    messageSchema.push({
                        content: element.message,
                        user: element.user[0].nickName,
                        time: hour3,
                    })
                });
                setMessages(messageSchema)
            } catch (error) {
                console.log(error);
            }
        }
        fetchRoomData()
    }, [token])

    useEffect(() => {
        if (token && roomData && roomData.name) {
            const socket = io(apiUrl);
            // Escucha eventos desde el servidor
            socket.on(roomData.name, ({message, senderName}) => {
                let hour = new Date().toLocaleTimeString()
                let hour2 = hour.split(":")
                let hour3 = hour2[0]+":"+hour2[1]
                const newMessage = {
                    user: senderName, // Aquí debes obtener el nombre del usuario
                    time: hour3, // Puedes personalizar el formato de la hora
                    content: message,
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
                console.log('Mensaje desde el servidor:', message);
            });
        
            // Limpieza del efecto
            return () => {
            // Desconectar el socket cuando el componente se desmonta
            socket.disconnect();
            };
        }
      }, [apiUrl, roomData, token]); // No olvides las dependencias del efecto


      const handleSendMessage = async(e) => {
        try {
            e.preventDefault()
            const response = await axios.post(`${apiUrl}messages`, {message: newMessage, roomId: id, user: userID} ,{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            setNewMessage('')
/*             // Aquí puedes procesar la respuesta del servidor
            const { user, content, time } = response.data.newMessage;

            // Puedes utilizar la información del usuario para mostrar el mensaje
            const newMessageData = {
                user: user.nickName, // o cualquier propiedad que contenga el nombre de usuario
                content,
                time
            };
            // Actualizar el estado de los mensajes en tu componente

        setMessages((prevMessages) => [...prevMessages, newMessageData]); */
        } catch (error) {
            console.error('Error', error);
            console.log(error.response.data.message);
        }
      }

      useEffect(() => {
        // Scroll al final cuando se cargan los mensajes
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, [messages]);

    
  return (
    <div className={styles.body}>
        <div className={styles.chat__container}>
            <section>
                <div className={styles.room__title}>
                    <NavLink to={'/'}>
                        <img src="../img/volver.png" alt="" />
                    </NavLink>
                    <h2>{roomData.name}</h2>
                </div>
                <div className={styles.message__container} ref={messagesContainerRef}>
                    {messages.length != 0? messages.map((msg, index) => (
                        <div key={index} className={`${msg.user == dataProfile.nickName ? styles.my__message : styles.other__message}`}>
                            <p>{msg.user}</p>
                            <p>{msg.content}</p>
                            <p>{msg.time}</p>
                        </div>
                    )): <div className={styles.empty__message}>No hay mensajes</div>}
                </div>
            </section>
            <form className={styles.input__message}>
                <input 
                type='text'
                name="" 
                id="" 
                placeholder='Escribe tu mensaje' 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}/>
                <button onClick={handleSendMessage}>
                    <img src="../img/enviar.png" alt=""/>
                </button>
            </form>
        </div>
    </div>
  )
}

export default Room