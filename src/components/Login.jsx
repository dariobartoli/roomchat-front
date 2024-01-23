import { useState } from 'react'
import { chatAuth } from '../context/chatContext'
import axios from 'axios'
import styles from '../styles/Login.module.css'
import Swal from 'sweetalert2'


const Login = () => {
    const [nickName, setNickName] = useState("")
    const [password, setPassword] = useState("")
    const [viewRegistro, setViewRegistro] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [newNickName, setNewNickName] = useState("")
    const [typeInput, setTypeInput] = useState('password')
    const {apiUrl, setToken, setUserID, setLogged, logged} = chatAuth()

    const login = async(e) => {
        e.preventDefault()
        try {
            axios.post(`${apiUrl}auth/login`, {nickName, password})
            .then(response => {
                setToken(response.data.token)
                setUserID(response.data.userId)
                setLogged(true)
                localStorage.setItem('tokenChat', response.data.token);
                localStorage.setItem('userIdChat', response.data.userId);
                localStorage.setItem('loggedChat', true);
                setNickName('')
                setPassword('')
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                icon: "success",
                title: response.data.message
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.response.data.message,
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: '#7c7c7c'
                  });
            });
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleTypeInput = (e) => {
        e.preventDefault()
        if(typeInput == "password"){
            setTypeInput('text')
        }else if(typeInput == "text"){
            setTypeInput('password')
        }
    }
    
    const registro = async(e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${apiUrl}auth/register`, {nickName: newNickName, password: newPassword})
            setViewRegistro(!viewRegistro)
            Swal.fire({
                icon: "success",
                title: response.data.message,
                confirmButtonText: "Cerrar",
                confirmButtonColor: '#7c7c7c'
            });
        } catch (error) {
            console.log(error);
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
    <div>
        {!logged?
        <form className={styles.form}>
            <input type="text" name="" id="nick" placeholder='Nickname' value={nickName} onChange={(e) => setNickName(e.target.value)}/>
            <input type="password" name="" id="pass" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={login} className={styles.button}>Iniciar Sesión</button>
            <p className={styles.register} onClick={() => setViewRegistro(!viewRegistro)}>Registro</p>
            {viewRegistro? 
            <div className={styles.registro__form}>
                <input type="text" placeholder='Crear nickname' value={newNickName} onChange={(e) => setNewNickName(e.target.value)}/>
                <input type={typeInput} placeholder='Crear contraseña' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <button onClick={registro}>Registrar</button>
                {typeInput == 'password'? <img src="../img/ver.png" alt="" className={styles.see__pasword} onClick={handleTypeInput}/> : <img src="../img/invisible.png" alt="" className={styles.see__pasword} onClick={handleTypeInput}/>}
            </div>
            : ""}
        </form>
        : null}
    </div>
  )
}

export default Login