import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import { createContext, useState } from 'react';

interface ContextType {
  auth: boolean;
  setAuth: (age: boolean) => void;
}
const authContext = createContext<ContextType | null>(null);

function App() {
  const [auth, setAuth] = useState(false);
  return (
    <authContext.Provider value={{ auth, setAuth }}>
      <BrowserRouter>
        <Routes>
          {!auth ?
            <Route path='/' element={<Login />} />
            :
            <>
              <Route path='/' element={<Dashboard />} />
              <Route path='/list' element={<TaskList />} />
            </>
          }
        </Routes>
      </BrowserRouter>
    </authContext.Provider>
  )
}
export { authContext, App }
