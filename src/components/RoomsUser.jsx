import {useState , useEffect} from 'react'
import { chatAuth } from '../context/chatContext'
import { NavLink } from 'react-router-dom'


const RoomsUser = () => {
    const [roomsData, setRoomsData] = useState([])
    const {token, dataProfile} = chatAuth()

    useEffect(() => {
        if(dataProfile && dataProfile.rooms){
            setRoomsData(dataProfile.rooms)
        }
    }, [dataProfile, token])
    
    
  return (
    <div>
        {roomsData.length>0? <h2>Tus salas</h2>: ""}
        
        {roomsData.length>0? 
        roomsData.map((item) => (
            <NavLink key={item._id} to={`/room/${item._id}`}>
                <h4>{item.name}</h4>
                <p>Miembros:</p>
                <p>{item.members.length}</p>
            </NavLink>
        ))
        : ""}
    </div>
  )
}

export default RoomsUser