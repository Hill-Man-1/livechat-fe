import {Routes, Route, Navigate} from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/login'
import Register from './pages/Register'
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from 'react-bootstrap'

import NavBar from './components/NavBar'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import { ChatContextProvider } from './context/ChatContext'
import { ProtectedRoute } from './components/ProtectedRoute'


function App() {
  const {user} = useContext(AuthContext)
  return (
    <>
    <ChatContextProvider user={user}>
      <NavBar/>
      <Container>
        <Routes>
          <Route path='/chat' element={
                <ProtectedRoute>
                    <Chat />
                </ProtectedRoute>}/>
          <Route path='/register' element={user? <Chat/> : <Register/>} />
          <Route path='/login' element={user? <Chat/> : <Login/>} />
          <Route path='*' element={<Navigate to='/login'/>} />
        </Routes>
      </Container>
    </ChatContextProvider>
    </>
  )
}

export default App
