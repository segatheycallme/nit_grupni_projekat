import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';

interface ContextType {
  auth: boolean;
  setAuth: (age: boolean) => void;
}
const authContext = createContext<ContextType | null>(null);
const [auth, setAuth] = useState(false);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <authContext.Provider value={{ auth, setAuth }}>
      <BrowserRouter>
        <Routes>
          {auth ?
            <Route path='/' element={<Login></Login>} />
            :
            <>
              <Route path='/' element={<Dashboard></Dashboard>} />
              <Route path='/list' element={<TaskList></TaskList>} />
            </>
          }
        </Routes>
      </BrowserRouter>
    </authContext.Provider>
  </StrictMode>,
)

export default authContext
