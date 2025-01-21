import { useContext } from "react";
import { authContext } from "../App";
import Paper from "../components/Paper"

function Login() {
  const setAuth = useContext(authContext)?.setAuth;
  return (
    <>
    <div className="text-3xl font-bold border-slate-600 border-solid border mt-20 mx-40 py-40 flex flex-col items-center justify-center">
      <Paper className="flex flex-col items-center space-y-4 w-1/3">
        <div className="flex flex-col space-y-4 w-full mb-auto">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"/>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div className="flex flex-col items-center">
            <button className="border-green-600 border-solid border-4 rounded-lg bg-green-300  ">Login</button>
            <button className="text-gray-400">Dont have an account? Click here</button>
          </div>
        </Paper>
    </div>
    </>
  )
}

export default Login
