import { useContext } from "react";
import { authContext } from "../App";
import Paper from "../components/Paper"

function Login() {
  const setAuth = useContext(authContext)?.setAuth;
  return (
    <div className="text-xl flex items-center justify-center h-full">
      <Paper className="flex flex-col items-center h-1/3 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <div className="flex flex-col space-y-4 w-full mb-auto">
          <h1 className="text-center text-3xl mt-6">Login</h1>
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500" />
          <input
            type="password"
            placeholder="Enter your password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500" />
        </div>
        <div className="flex flex-col items-center">
          <button className="border-sky-800 border-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-1 text-white">Login</button>
          <button className="text-gray-400 text-md m-2 hover:text-gray-500">Dont have an account? Click here</button>
        </div>
      </Paper>
    </div>
  )
}

export default Login
