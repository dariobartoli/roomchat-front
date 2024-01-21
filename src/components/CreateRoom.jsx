import React from 'react'
import styles from '../styles/CreateRoom.module.css'
import { useRef, useEffect } from 'react'

const CreateRoom = ({viewCreateRoom, setViewCreateRoom}) => {
    const refElement = useRef(null);

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
  return (
    <div className={styles.body}>
        <div className={styles.createroom__container} ref={refElement}>
            <h3>Crear Sala</h3>
            <form>
                <label htmlFor="contra">Contraseña: </label>
                <input type="text" name='contra' id='contra'/>
            </form>
            <button>Crear nueva sala</button>
        </div>
    </div>
  )
}

export default CreateRoom