import React from 'react'
import Login from '../components/Login'
import Rooms from '../components/Rooms'
import RoomsUser from '../components/RoomsUser'
import styles from '../styles/Index.module.css'
import Logout from '../components/Logout'
import { chatAuth } from '../context/chatContext'


const Index = () => {
  const {logged} = chatAuth()
  return (
    <div className={styles.body}>
        <Login/>
        {logged? 
        <RoomsUser/>
        :""}
        {logged? 
        <Rooms/>
        :""}
        {logged? 
        <Logout/>
        :""}
    </div>
  )
}

export default Index