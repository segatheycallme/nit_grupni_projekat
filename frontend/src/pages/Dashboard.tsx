import { NavLink } from "react-router"
import DashboardCard from "../components/DashboardCard"
import Paper from "../components/Paper"
import { useContext, useEffect, useState } from "react"
import { getTasks, Task } from "../api/task"
import { authContext } from "../App"

function Dashboard() {
  const token = useContext(authContext).auth;
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    getTasks(token).then((res) => setTasks(res))
  }, [])

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
    <div className="flex items-center justify-center h-full">
      <Paper className="w-full sm:w-2/3 flex relative">
        <div className="flex justify-between flex-col gap-2 h-full pr-4 border-r-4">
          <DashboardCard color="bg-slate-200" num={todo} helper="To-Do" />
          <DashboardCard color="bg-sky-200" num={inprogress} helper="In Progress" />
          <DashboardCard color="bg-green-200" num={done} helper="Done" />
        </div>
        <div className="flex flex-col w-full">
          {tasks.length ? tasks.map((task) => {
            return (
              <div className="p-2 text-xl flex justify-between w-full">
                <span>{task.message}</span>
                <button className="text-green-700">☑</button>
              </div>
            )
          }) :
            <span className="text-3xl absolute left-1/2 top-8">All done!</span>
          }
        </div>
        <NavLink to="/list">
          <button className="bg-sky-300 text-white text-bold text-xl p-2 px-6 absolute bottom-2 left-1/2 rounded-xl">See all</button>
        </NavLink>
      </Paper>
    </div>
  )
}

export default Dashboard
