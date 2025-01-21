import { useContext, useState } from "react";
import { authContext } from "../App";
import Paper from "../components/Paper"
import { NavLink } from "react-router";
import { login } from "../api/auth";
function Login() {
  const setAuth = useContext(authContext).setAuth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="text-xl flex items-center justify-center h-full">
      <Paper className="flex flex-col items-center h-1/3 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <div className="flex flex-col space-y-4 w-full mb-auto">
          <h1 className="text-center text-3xl mt-6">Login</h1>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500" />
        </div>
        <div className="flex flex-col items-center">
          <button className="border-sky-800 border-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-1 text-white" onClick={() => {
            login(email, password).then((res) => setAuth(res.token));
            setEmail("");
            setPassword("");
          }}>Login</button>
          <NavLink to="/register"><button className="text-gray-400 text-md m-2 hover:text-gray-500">Dont have an account? Click here</button></NavLink>
        </div>
      </Paper>
    </div>
  )
}

export default Login
