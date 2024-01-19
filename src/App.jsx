import './App.css'
import Room from './components/Room'
import Rooms from './components/Rooms'
import Login from './components/login'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Index from './pages/Index';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Index/>}/>
          <Route path='/room/:id' element={<Room/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
