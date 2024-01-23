import React from 'react'
import Login from '../components/Login'
import Rooms from '../components/Rooms'
import RoomsUser from '../components/RoomsUser'
import styles from '../styles/Index.module.css'
import Logout from '../components/Logout'

const Index = () => {
  return (
    <div className={styles.body}>
        <Login/>
        <RoomsUser/>
        <Rooms/>
        <Logout/>
    </div>
  )
}

export default Index