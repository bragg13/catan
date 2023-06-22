import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage/LoginPage';
import PlayPage from './PlayPage/PlayPage';
import LobbyPage from './LobbyPage/LobbyPage'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:4000')

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <LoginPage socket={socket} />
          }
        />
        <Route
          path='/lobby'
          element={
            <LobbyPage socket={socket} />
          }
        />
        <Route
          path='/play'
          element={
            <PlayPage socket={socket} />
          }
        />
      </Routes>
    </Router>
  )
}