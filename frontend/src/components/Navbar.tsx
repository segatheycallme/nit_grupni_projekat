import { useContext, useEffect, useState } from "react";
import { authContext } from "../App";
import { useLocation } from "react-router";
import { NavLink } from "react-router";

export default function Navbar() {
  const { auth, setAuth } = useContext(authContext);
  let [page, setPage] = useState("")
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        if (auth) {
          setPage("Dashboard")
          break;
        }
        setPage("Login")
        break;
      case "/login":
        setPage("Login")
        break;
      case "/dashboard":
        setPage("Dashboard")
        break;
      case "/list":
        setPage("TaskList")
        break;
      case "/register":
        setPage("Register")
        break;
      default:
        setPage("?")
        break;
    }
  }, [location.pathname])

  return (
    <div className="fixed flex justify-between items-center px-4 bg-white w-screen h-16">
      <div className="flex items-center">
        <NavLink to="/"><h1 className="text-3xl text-sky-600 hover:text-sky-500 font-bold tracking-wide mr-4" >To-Do</h1></NavLink>
        <h1 className="text-2xl text-sky-500 tracking-wide pl-5 border-l-2 border-sky-300">{page}</h1>
      </div>
      {auth ?
        <NavLink to="/login"><button className="text-xl text-sky-800 font-extrabold tracking-widest" onClick={() => setAuth("")}>LOGOUT</button></NavLink>
        : <></>}
    </div>
  )
}

