import { useContext, useEffect, useState } from "react"
import Paper from "../components/Paper"
import { addTask, deleteTask, getTasks, Task, updateTask } from '../api/task.ts'
import { authContext } from "../App.tsx";

const statuses = ["To-Do", "In Progress", "Done"];
const status_color_lookup = new Map()
status_color_lookup.set("To-Do", "text-slate-700");
status_color_lookup.set("In Progress", "text-sky-700");
status_color_lookup.set("Done", "text-green-700");

const priorities = ["Low", "Medium", "High"]; // get your -- straight
const priority_color_lookup = new Map()
priority_color_lookup.set("Low", "text-green-700");
priority_color_lookup.set("Medium", "text-yellow-700");
priority_color_lookup.set("High", "text-red-700");


function cycleThing(stvar: string, stvari: string[], direction: number) {
  let idx = stvari.findIndex((el) => el === stvar) + direction;
  if (idx < 0) {
    idx = 2
  }
  if (idx > 2) {
    idx = 0
  }
  return stvari[idx]
}

function TaskList() {
  const token = useContext(authContext).auth;

  const [editID, setEditID] = useState(-1);
  const [editValue, setEditValue] = useState<string | null>("");
  const [newTaskMessage, setNewTaskMessage] = useState<string | null>("");
  const [newTaskStatus, setNewTaskStatus] = useState<string | null>("To-Do");
  const [newTaskPriority, setNewTaskPriority] = useState<string | null>("Low");
  const [searchText, setSearchText] = useState<string | null>("");
  const [tasks, setTasks] = useState<Task[]>([])
  const [refresh, setRefresh] = useState(false)
  const [prf, setPrf] = useState({
    "Low": true,
    "Medium": true,
    "High": true,
  })
  const [srf, setSrf] = useState({
    "To-Do": true,
    "In Progress": true,
    "Done": true,
  })
  useEffect(() => {
    getTasks(token, searchText || "",
      Object.entries(prf).filter((val) => val[1]).map((val) => val[0]),
      Object.entries(srf).filter((val) => val[1]).map((val) => val[0]),
    ).then((res) => setTasks(res))
  }, [refresh, searchText, prf, srf])

  return (
    <div className="flex items-center justify-center h-full">
      <Paper className="h-3/4 w-full lg:w-3/4 overflow-x-scroll lg:overflow-auto">
        <div className="flex flex-col">
          <div className="w-full border-b-2 mb-2 py-2 flex">
            <span>Search:</span>
            <input value={searchText || ""} onChange={(e) => setSearchText(e.target.value)} placeholder="Filter by title text here" className="rounded-lg bg-slate-100 pl-2 ml-1 w-max lg:w-1/3" />
            <div className="text-sm flex gap-2 ml-8">
              <button className={"border-2 w-max px-1 rounded-lg " + (prf["Low"] ? "border-sky-300" : "")} onClick={() => setPrf({ ...prf, "Low": !prf["Low"] })}>Low</button>
              <button className={"border-2 w-max px-1 rounded-lg " + (prf["Medium"] ? "border-sky-300" : "")} onClick={() => setPrf({ ...prf, "Medium": !prf["Medium"] })}>Medium</button>
              <button className={"border-2 w-max px-1 rounded-lg " + (prf["High"] ? "border-sky-300" : "")} onClick={() => setPrf({ ...prf, "High": !prf["High"] })}>High</button>
              <button className={"border-2 w-max px-1 rounded-lg " + (srf["To-Do"] ? "border-sky-300" : "")} onClick={() => setSrf({ ...srf, "To-Do": !srf["To-Do"] })}>To-Do</button>
              <button className={"border-2 w-max px-1 rounded-lg " + (srf["In Progress"] ? "border-sky-300" : "")} onClick={() => setSrf({ ...srf, "In Progress": !srf["In Progress"] })}>In Progress</button>
              <button className={"border-2 w-max px-1 rounded-lg " + (srf["Done"] ? "border-sky-300" : "")} onClick={() => setSrf({ ...srf, "Done": !srf["Done"] })}>Done</button>
            </div>
          </div>
          {tasks ?
            <table className="min-w-full w-max sm:w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-2 w-max">Task title</th>
                  <th className="border-2 w-max px-6 sm:w-40">Status</th>
                  <th className="border-2 w-max px-4 sm:w-40">Priority</th>
                  <th className="border-2 w-max px-2 sm:w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, i) => {
                  return (
                    <tr className="text-lg">
                      <td className="border-2">{editID === i ?
                        <div className="flex">
                          <input type="text" className="bg-slate-100 border-b border-slate-400 pl-1 w-full" value={editValue || ""} onChange={(e) => setEditValue(e.target.value)} />
                          <button className="ml-8 mr-2" onClick={() => {
                            updateTask({ ...task, title: editValue || "" }, token).then(() => setRefresh(!refresh))
                            setEditID(-1);
                          }}>ok</button>
                        </div>
                        : <span className="pl-1">{task.title}</span>}</td>
                      <td className="text-center border-2">
                        <button className="font-bold" onClick={() => { updateTask({ ...task, status: cycleThing(task.status, statuses, -1) }, token).then(() => setRefresh(!refresh)) }}>{"<"}</button>
                        <span className={status_color_lookup.get(task.status)}> {task.status} </span>
                        <button className="font-bold" onClick={() => { updateTask({ ...task, status: cycleThing(task.status, statuses, +1) }, token).then(() => setRefresh(!refresh)) }}>{">"}</button>
                      </td>
                      <td className="text-center border-2">
                        <button className="font-bold" onClick={() => { updateTask({ ...task, priority: cycleThing(task.priority, priorities, -1) }, token).then(() => setRefresh(!refresh)) }}>{"<"}</button>
                        <span className={priority_color_lookup.get(task.priority)}> {task.priority} </span>
                        <button className="font-bold" onClick={() => { updateTask({ ...task, priority: cycleThing(task.priority, priorities, +1) }, token).then(() => setRefresh(!refresh)) }}>{">"}</button>
                      </td>
                      <td className="text-center border-2">
                        <button className="mr-2" onClick={() => {
                          setEditID(i);
                          setEditValue(task.title);
                        }}>✎</button>
                        <button onClick={() => {
                          deleteTask(task, token).then(() =>
                            setRefresh(!refresh))
                        }}>🗑</button>
                      </td>
                    </tr>
                  )
                })}
                <tr className="text-lg">
                  <td className="border-2 flex">
                    <input type="text" className="bg-slate-100 pl-1 w-full" value={newTaskMessage || ""} onChange={(e) => setNewTaskMessage(e.target.value)} />
                  </td>
                  <td className="border-2 text-center">
                    <button className="font-bold" onClick={() => setNewTaskStatus(cycleThing(newTaskStatus || "", statuses, -1))}>{"<"}</button>
                    <span className={status_color_lookup.get(newTaskStatus)}> {newTaskStatus} </span>
                    <button className="font-bold" onClick={() => setNewTaskStatus(cycleThing(newTaskStatus || "", statuses, +1))}>{">"}</button>
                  </td>
                  <td className="border-2 text-center">
                    <button className="font-bold" onClick={() => setNewTaskPriority(cycleThing(newTaskPriority || "", priorities, -1))}>{"<"}</button>
                    <span className={priority_color_lookup.get(newTaskPriority)}> {newTaskPriority} </span>
                    <button className="font-bold" onClick={() => setNewTaskPriority(cycleThing(newTaskPriority || "", priorities, +1))}>{">"}</button>
                  </td>
                  <td className="border-2 text-center"><button onClick={() => {
                    addTask({ id: -1, title: newTaskMessage || "", status: newTaskStatus || "", priority: newTaskPriority || "" }, token).then(() => setRefresh(!refresh))
                    setNewTaskMessage("");
                    setNewTaskStatus("To-Do");
                    setNewTaskPriority("Low");
                  }}>add</button></td>
                </tr>
              </tbody>
            </table>
            : "no tasks"}
        </div>
      </Paper>
    </div>
  )
}

export default TaskList
