import React from 'react'
import Login from '../components/login'
import Rooms from '../components/Rooms'
import RoomsUser from '../components/RoomsUser'
import styles from '../styles/Index.module.css'

const Index = () => {
  return (
    <div className={styles.body}>
        <Login/>
        <RoomsUser/>
        <Rooms/>
    </div>
  )
}

export default Index