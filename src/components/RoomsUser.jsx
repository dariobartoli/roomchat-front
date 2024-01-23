import {useState , useEffect} from 'react'
import { chatAuth } from '../context/chatContext'
import { NavLink } from 'react-router-dom'
import styles from '../styles/RoomUsers.module.css'


const RoomsUser = () => {
    const [roomsData, setRoomsData] = useState([])
    const {token, dataProfile, updateData, logged} = chatAuth()

    useEffect(() => {
        if(dataProfile && dataProfile.rooms){
            setRoomsData(dataProfile.rooms)
        }
    }, [dataProfile, token, updateData])

    console.log(roomsData);
    
  return (
    <div className={styles.body}>
        {logged?
        <h2>Tus salas</h2>
        : ""}
        {logged? 
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
            : <p style={{color:"white", textAlign:"center"}}>No estás en ninguna sala, ingresa a una para empezar a chatear</p>}
        </div>
        :""}
    </div>
  )
}

export default RoomsUser