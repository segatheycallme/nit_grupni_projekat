import { useState } from "react"
import Paper from "../components/Paper"

interface Task {
  message: string
  status: string
}

const tasks: Task[] | null =
  [
    { message: "do the laundry", status: "To-Do" },
    { message: "do the bed", status: "Done" },
    { message: "do the clock", status: "To-Do" },
    { message: "do the radiator", status: "In Progress" },
  ]

const statuses = ["To-Do", "In Progress", "Done"];
const color_lookup = new Map()
color_lookup.set("To-Do", "text-slate-700");
color_lookup.set("In Progress", "text-sky-700");
color_lookup.set("Done", "text-green-700");

function cycleStatus(currStatus: string, direction: number) {
  let idx = statuses.findIndex((el) => el === currStatus) + direction;
  if (idx < 0) {
    idx = 2
  }
  if (idx > 2) {
    idx = 0
  }
  return statuses[idx]
}

function TaskList() {
  const [editID, setEditID] = useState(-1);
  const [editValue, setEditValue] = useState<string | null>("");

  return (
    <div className="flex items-center justify-center h-full">
      <Paper className="h-3/4 w-full sm:w-3/4">
        {tasks ?
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-2 w-4/5">Task message</th>
                <th className="border-2 w-1/6">Status</th>
                <th className="border-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => {
                return (
                  <tr className="text-lg">
                    <td className="border-2">{editID === i ?
                      <div className="flex">
                        <input type="text" className="bg-slate-200 border border-slate-400 pl-1 w-full" value={editValue || ""} onChange={(e) => setEditValue(e.target.textContent)} />
                        <button className="ml-8 mr-2" onClick={() => {
                          setEditID(-1);
                        }}>ok</button>
                      </div>
                      : <span className="pl-1">{task.message}</span>}</td>
                    <td className="text-center border-2">
                      <button className="font-bold" onClick={() => console.log(cycleStatus(task.status, -1))}>{"<"}</button>
                      <span className={color_lookup.get(task.status)}> {task.status} </span>
                      <button className="font-bold" onClick={() => console.log(cycleStatus(task.status, +1))}>{">"}</button>
                    </td>
                    <td className="text-center border-2">
                      <button className="mr-2" onClick={() => {
                        setEditID(i);
                        setEditValue(task.message);
                      }}>e</button>
                      <button onClick={() => {
                      }}>d</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          : "no tasks"}
      </Paper>
    </div>
  )
}

export default TaskList
