import {Routes, Route, Navigate} from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/login';
import Register from './pages/Register';
import RegisterByAdmin from './pages/RegisterByAdmin';
import "bootstrap/dist/css/bootstrap.min.css";
import {Container} from 'react-bootstrap';
import NavBar from './components/NavBar';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ChatContextProvider } from './context/ChatContext';
import { ProtectedRoute } from './components/ProtectedRoute'; // Make sure this import is correct
import RegisterMedicalPersonnel from './pages/RegisterMedicalPersonnel';
import RegisterMedicalFacility from './pages/RegisterMedicalFacility';

function App() {
  const {user} = useContext(AuthContext);
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar/>
        <Container>
          <Routes>
            <Route path='/chat' element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }/>
            <Route path='/registerfacility' element={isAdmin ? <RegisterMedicalFacility/> : <Navigate replace to="/chat" />}/>
            <Route path='/registerpersonnel' element={isAdmin ? <RegisterMedicalPersonnel/> : <Navigate replace to="/chat" />}/>
            <Route path='/registeruser' element={isAdmin ? <RegisterByAdmin/> : <Navigate replace to="/chat" />}/>
            <Route path='/register' element={!user ? <Register/> : <Navigate replace to="/chat" />} />
            <Route path='/login' element={!user ? <Login/> : <Navigate replace to="/chat" />} />
            <Route path='*' element={<Navigate replace to={user ? '/chat' : '/login'} />} />
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  );
}

export default App;