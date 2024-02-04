import {useState , useEffect} from 'react'
import { chatAuth } from '../context/chatContext'
import styles from '../styles/Rooms.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import CreateRoom from './CreateRoom';
import Swal from 'sweetalert2'


const Rooms = () => {
    const [roomsData, setRoomsData] = useState([])
    const [passwords, setPasswords] = useState("")
    const [viewCreateRoom, setViewCreateRoom] = useState(false)
    const {apiUrl, token, dataProfile, logged, updateData, setUpdateData} = chatAuth()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomsData = async() => {
            try {
                const response = await axios.get(`${apiUrl}room`)
                const roomsFilter = response.data.rooms.filter(room => {
                    return !dataProfile.rooms.some(profileRoom => profileRoom._id === room._id);
                });
                setRoomsData(roomsFilter)  
            } catch (error) {
                console.log(error);
            }
        }
        fetchRoomsData()
    }, [token, dataProfile, updateData])

    const handlePasswordChange = (roomId, newPassword) => {
        setPasswords(prevPasswords => ({
          ...prevPasswords,
          [roomId]: newPassword
        }));
    };

    const joinRoom = async(id) => {
        try {
            let password = passwords[id];
            if(password == undefined){
                password = ""
            }
            const response = await axios.post(`${apiUrl}room/join`, {roomId: id, password},{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            Swal.fire({
                icon: "success",
                title: response.data.message,
                text: `Sala: ${response.data.room.name}`,
                confirmButtonText: "Cerrar",
                confirmButtonColor: '#7c7c7c'
            }).then(() => {
                navigate(`/room/${id}`)
                setUpdateData(!updateData)
            });
            console.log(response.data);
        } catch (error) {
            console.error('error', error)
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
    <div className={styles.rooms__container}>
        {logged? 
        <div className={styles.rooms_title__contain}>
            <h2>Descubrir</h2> 
            <img src="../img/agregar.png" alt="" onClick={() => setViewCreateRoom(!viewCreateRoom)}/>
        </div>
        :""}
        <div className={styles.rooms__box__contain}>
            {roomsData.length>0? 
            roomsData.map((item) => (
                <div key={item._id} className={styles.rooms__box}>
                    <h4>{item.name}</h4>
                    <section>
                        {item.password? <input type="password" placeholder='Contraseña' name="pass" id={`pass-${item._id}`} className={styles.input} value={passwords[item._id] || ''} onChange={(e) => handlePasswordChange(item._id, e.target.value)}/> : ""}
                        {item.password? <button className={styles.button} onClick={() => joinRoom(item._id)}>Entrar</button> : <button className={`${styles.button__notpwd} ${styles.button}`} onClick={() => joinRoom(item._id)}>Entrar</button>}
                    </section>
                    <section>
                        <img src="../img/usuario.png" alt="" className={styles.members__image}/>
                        <p>{item.members.length}</p>
                    </section>
                    {item.password? <img src="../img/candado.png" alt="" className={styles.rooms__image}/> : ""}
                    
                </div>
            ))
            : "" }
        </div>
        {viewCreateRoom?<CreateRoom viewCreateRoom={viewCreateRoom} setViewCreateRoom={setViewCreateRoom}/> : ""}
        
    </div>
  )
}

export default Rooms