import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import { createContext, useEffect, useState } from 'react';
import Navbar from './components/Navbar.tsx'
import { useLocation } from 'react-router';

interface ContextType {
  auth: string;
  setAuth: (token: string) => void;
}
const authContext = createContext<ContextType>({ auth: "", setAuth: () => { } });

function App() {
  const [auth, setAuth] = useState("");
  return (
    <authContext.Provider value={{ auth, setAuth }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {!auth ?
            <>
              <Route path='/*' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </>
            :
            <>
              <Route path='/*' element={<Dashboard />} />
              <Route path='/list' element={<TaskList />} />
            </>
          }
        </Routes>
      </BrowserRouter>
    </authContext.Provider>
  )
}
export { authContext, App }
