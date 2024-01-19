import {useState , useEffect} from 'react'
import { chatAuth } from '../context/chatContext'
import styles from '../styles/Rooms.module.css'

import axios from 'axios'

const Rooms = () => {
    const [roomsData, setRoomsData] = useState([])
    const {apiUrl, token, dataProfile, logged} = chatAuth()


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
    }, [token, dataProfile])
    
    return (
    <div className={styles.rooms__container}>
        {logged? <h2>Descubrir</h2> :""}
        <div className={styles.rooms__box__contain}>
            {roomsData.length>0? 
            roomsData.map((item) => (
                <div key={item._id} className={styles.rooms__box}>
                    <h4>{item.name}</h4>
                    <div>
                        <p>Miembros:</p>
                        <p>{item.members.length}</p>
                    </div>
                    {item.password? <img src="../img/candado.png" alt="" className={styles.rooms__image}/> : ""}
                    
                </div>
            ))
            : "" }
        </div>
    </div>
  )
}

export default Rooms