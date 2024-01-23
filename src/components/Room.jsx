import {useState, useEffect, useRef } from 'react'
import { chatAuth } from '../context/chatContext'
import axios from 'axios'
import io from 'socket.io-client';
import { useParams, useNavigate } from "react-router-dom";
import styles from '../styles/Room.module.css'
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2'



const Room = () => {
    const [roomData, setRoomData] = useState([])
    const [messages, setMessages] = useState([]);
    const [viewMenu, setViewMenu] = useState(false)
    const [dataUsers, setDataUsers] = useState([])
    const {token, apiUrl, userID, dataProfile, updateData, setUpdateData} = chatAuth()
    const [newMessage, setNewMessage] = useState('')
    const { id } = useParams();
    const messagesContainerRef = useRef(null);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchRoomData = async() => {
            try {
                const response = await axios.get(`${apiUrl}room/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setRoomData(response.data.room)
                console.log(response.data.room);
                let messageSchema = []
                response.data.room.history.forEach(element => {
                    let date = element.createdAt.split('T')
                    let hour = date[1].split('.')
                    let hour2 = hour[0].split(':')
                    let hourFix
                    let date1 = date[0].split('-')
                    let date2 = date1[2]+"-"+date1[1]+"-"+date1[0]
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
                        date: date2
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
        if(roomData && roomData.members){
            const members = roomData.members
            const userInfo = async(userId) => {
                try {
                    const response = await axios(`${apiUrl}user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    return response.data.user
                } catch (error) {
                    console.error('Error', error);
                }
            }
            const promises = members.map(item => userInfo(item))
            Promise.all(promises)
                .then(userData => {
                    setDataUsers(userData)
                })
                .catch(error => {
                    console.error('Error', error);
                })
        }
    }, [token, roomData])



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
                    date: "no"
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
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
        } catch (error) {
            console.error('Error', error);
            console.log('Entre al error');
            console.log(error.response.data.message);
        }
      }

      useEffect(() => {
        // Scroll al final cuando se cargan los mensajes
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, [messages]);

      const deleteRoom = async(id)=>{
        try {
            const response = await axios.delete(`${apiUrl}room/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            Swal.fire({
                icon: "success",
                title: response.data.message,
                confirmButtonText: "Cerrar",
                confirmButtonColor: '#7c7c7c'
            }).then(() => {
                navigate('/')
            });
        } catch (error) {
            console.error('Error', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.message,
                confirmButtonText: "Cerrar",
                confirmButtonColor: '#7c7c7c'
            })
        }
      }

      const leaveRoom = async(id)=>{
        try {
            const response = await axios.put(`${apiUrl}room/`, {id:id} ,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            Swal.fire({
                icon: "success",
                title: response.data.message,
                confirmButtonText: "Cerrar",
                confirmButtonColor: '#7c7c7c'
            }).then(() => {
                navigate('/')
            });
        } catch (error) {
            console.error('Error', error);
            console.log(error.response.data.message);
        }
      }

      

    
  return (
    <div className={styles.body}>
        <div className={styles.chat__container}>
            <section>
                <div className={styles.room__title}>
                    <NavLink to={'/'}>
                        <img src="../img/volver.png" alt="" />
                    </NavLink>
                    <h2>{roomData.name}</h2>
                    <img src="../img/tres-puntos.png" alt="" onClick={() => setViewMenu(!viewMenu)}/>
                </div>
                <div className={styles.message__container} ref={messagesContainerRef}>
                    {messages.length != 0? messages.map((msg, index) => (
                        <div key={index} >
                            {/* Mostrar la fecha solo si es diferente de la fecha anterior */}
                            {(index === 0 || messages[index - 1].date !== msg.date) && msg.date != "no"? (
                                <p className={styles.date}>{msg.date}</p>
                            ) : null}
                            <div className={`${msg.user == dataProfile.nickName ? styles.my__message : styles.other__message}`}>
                                <p>{msg.user}</p>
                                <p>{msg.content}</p>
                                <p>{msg.time}</p>
                                <div className={`${msg.user == dataProfile.nickName ? styles.my__div : styles.other__div}`}></div>
                            </div>
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

            {viewMenu? 
            <div className={styles.menu__container}>
                <div>
                    <h4>Miembros: </h4>
                    <ul className={styles.menu__list}>
                        {dataUsers? dataUsers.map((item) => (
                            <div key={item._id}>
                                <li>{item.nickName}</li>
                            </div>
                        )): ""}
                    </ul>
                </div>
                <h5 onClick={() => leaveRoom(roomData._id)}>Salir de la sala</h5>
                <h5 onClick={() => deleteRoom(roomData._id)}>Eliminar sala</h5>
            </div>
            : ""}

        </div>
    </div>
  )
}

export default Room