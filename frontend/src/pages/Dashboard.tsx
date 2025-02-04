import { NavLink } from "react-router"
import DashboardCard from "../components/DashboardCard"
import Paper from "../components/Paper"
import { useContext, useEffect, useState } from "react"
import { getTasks, getUser, Task, updateTask } from "../api/task"
import { authContext } from "../App"

function Dashboard() {
  const token = useContext(authContext).auth;
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<string>("")
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    getTasks(token).then((res) => setTasks(res))
    getUser(token).then((res) => setUser(res.username))
  }, [refresh])

  let todo = 0;
  let inprogress = 0;
  let done = 0;
  for (let i = 0; i < tasks.length; i++) {
    const el = tasks[i];
    if (el.status === "To-Do") {
      todo++;
    }
    if (el.status === "In Progress") {
      inprogress++;
    }
    if (el.status === "Done") {
      done++;
    }
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-full">
      <Paper className="w-full sm:w-2/3 my-24">
        <h1 className="text-xl text-center font-bold mb-1 mt-4 pb-3 w-full border-b-2">Welcome, {user}!</h1>
        <div className="flex relative">
          <div className="flex justify-between flex-col gap-2 h-full pr-4">
            <DashboardCard color="stroke-slate-300" num={todo} total={tasks.length} helper="To-Do" />
            <DashboardCard color="stroke-sky-300" num={inprogress} total={tasks.length} helper="In Progress" />
            <DashboardCard color="stroke-green-300" num={done} total={tasks.length} helper="Done" />
          </div>
          <div className="flex flex-col w-full border-l-2 relative pb-8">
            {tasks.filter((task) => task.status !== "Done").length ? tasks.filter((task) => task.status !== "Done").map((task) => {
              return (
                <div className="p-2 text-xl flex justify-between w-full">
                  <span className={task.status === "In Progress" ? "border-l-4 px-1 border-sky-400" : ""}>{task.title}</span>
                  <button className="text-green-700 font-bold" onClick={() => updateTask({ ...task, status: "Done" }, token).then(() => setRefresh(!refresh))}>☑</button>
                </div>
              )
            }) :
              <span className="text-3xl w-full text-center mt-4">All done!</span>
            }
            <NavLink to="/list">
              <div className="w-full text-center absolute bottom-0">
                <button className="bg-sky-600 hover:bg-sky-500 text-white text-bold text-xl px-4 py-1 bottom-2 rounded-lg">See all</button>
              </div>
            </NavLink>
          </div>
          <div></div>
        </div>
      </Paper>
    </div>
  )
}

export default Dashboard
