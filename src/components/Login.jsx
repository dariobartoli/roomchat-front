import { useState } from 'react'
import { chatAuth } from '../context/chatContext'
import axios from 'axios'
import styles from '../styles/Login.module.css'

const Login = () => {
    const [nickName, setNickName] = useState("")
    const [password, setPassword] = useState("")
    const {apiUrl, setToken, setUserID, setLogged, logged} = chatAuth()

    const login = async(e) => {
        e.preventDefault()
        try {
            axios.post(`${apiUrl}auth/login`, {nickName, password})
            .then(response => {
                setToken(response.data.token)
                setUserID(response.data.userId)
                setLogged(true)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                setNickName('')
                setPassword('')
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error de inicio de sesión:', error);
            });
        } catch (error) {
            console.log(error.message);
        }
    }
    


  return (
    <div>
        {!logged?
        <form className={styles.form}>
            <input type="text" name="" id="" placeholder='Nickname' value={nickName} onChange={(e) => setNickName(e.target.value)}/>
            <input type="password" name="" id="" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={login} className={styles.button}>Iniciar Sesión</button>
        </form>
        : null}
    </div>
  )
}

export default Login