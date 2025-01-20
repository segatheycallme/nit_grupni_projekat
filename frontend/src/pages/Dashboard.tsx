import { NavLink } from "react-router"
import DashboardCard from "../components/DashboardCard"
import Paper from "../components/Paper"

const tasks: string[] | null =
  [
    "do the laundry",
    "do the bed",
    "do the clock",
    "do the radiator"
  ]

function Dashboard() {
  return (
    <div className="flex items-center justify-center h-full">
      <Paper className="w-full sm:w-2/3 flex relative">
        <div className="flex justify-between flex-col gap-2 h-full pr-4 border-r-4">
          <DashboardCard color="bg-slate-200" num={5} helper="To-Do" />
          <DashboardCard color="bg-sky-200" num={6} helper="In Progress" />
          <DashboardCard color="bg-green-200" num={3} helper="Done" />
        </div>
        <div className="flex flex-col w-full">
          {tasks ? tasks.map((task) => {
            return (
              <div className="p-2 text-xl flex justify-between w-full">
                <span>{task}</span>
                <button className="text-green-700">done</button>
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
