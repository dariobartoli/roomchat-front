import React from 'react'
import styles from '../styles/CreateRoom.module.css'
import { useRef, useEffect, useState } from 'react'
import { chatAuth } from '../context/chatContext'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'


const CreateRoom = ({viewCreateRoom, setViewCreateRoom}) => {
    const refElement = useRef(null);
    const [nombre, setNombre] = useState('')
    const [password, setPassword] = useState('')
    const {apiUrl, setUpdateData, updateData, token} = chatAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (refElement.current && !refElement.current.contains(event.target)) {
            // Lógica que deseas ejecutar cuando se hace clic fuera del elemento
            setViewCreateRoom(false)
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const createRoom = async(e) => {
        e.preventDefault()
        try {
          const response = await axios.post(`${apiUrl}room`,{name: nombre, password: password}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          setUpdateData(!updateData)
          setViewCreateRoom(false)
          setNombre('')
          setPassword('')
          console.log(response.data.newRoom._id);
          navigate(`/room/${response.data.newRoom._id}`)
          Swal.fire({
            icon: "success",
            title: response.data.message,
            confirmButtonText: "Cerrar",
            confirmButtonColor: '#7c7c7c'
          });
        } catch (error) {
          console.error('Error', error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message,
            confirmButtonText: "Cerrar",
            confirmButtonColor: '#7c7c7c'
          });
        }
      }
  return (
    <div className={styles.body}>
        <div className={styles.createroom__container} ref={refElement}>
            <h3>Crear Sala</h3>
            <form>
                <div>
                  <label htmlFor="name">Nombre: </label>
                  <input type="text" name='name' id='name' value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                </div>
                <div>
                  <label htmlFor="contra">Contraseña: </label>
                  <input type="text" name='contra' id='contra' value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </form>
            <button onClick={createRoom}>Crear nueva sala</button>
        </div>
    </div>
  )
}

export default CreateRoom