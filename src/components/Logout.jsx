import React from 'react'
import { chatAuth } from '../context/chatContext'
import styles from '../styles/Logout.module.css'

const Logout = () => {
    const { logged } = chatAuth()

    const handleLogout = () => {
        localStorage.removeItem('loggedChat')
        localStorage.removeItem('userIdChat')
        localStorage.removeItem('tokenChat')
        window.location.reload()
    }
  return (
    <div>
        {logged ? <button onClick={handleLogout} className={styles.button}>Cerrar sesión</button> : "" }
    </div>
  )
}

export default Logout