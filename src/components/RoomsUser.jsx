import {useState , useEffect} from 'react'
import { chatAuth } from '../context/chatContext'
import { NavLink } from 'react-router-dom'
import styles from '../styles/RoomUsers.module.css'


const RoomsUser = () => {
    const [roomsData, setRoomsData] = useState([])
    const {token, dataProfile, updateData} = chatAuth()

    useEffect(() => {
        if(dataProfile && dataProfile.rooms){
            setRoomsData(dataProfile.rooms)
        }
    }, [dataProfile, token, updateData])
    
    
  return (
    <div className={styles.body}>
        {roomsData.length>0? 
        <h2>Tus salas</h2>: 
        ""}
        <div className={styles.rooms__container}>
            {roomsData.length>0? 
            roomsData.map((item) => (
                <NavLink key={item._id} to={`/room/${item._id}`} className={styles.room__box}>
                    <h4>{item.name}</h4>
                    <div>
                        <img src="../img/usuario.png" alt="" className={styles.room__box__image}/>
                        <p>{item.members.length}</p>
                    </div>
                </NavLink>
            ))
            : ""}
        </div>
    </div>
  )
}

export default RoomsUser