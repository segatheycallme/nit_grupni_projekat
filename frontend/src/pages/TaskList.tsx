import { useContext, useEffect, useState } from "react"
import Paper from "../components/Paper"
import { addTask, deleteTask, getTasks, Task, updateTask } from '../api/task.ts'
import { authContext } from "../App.tsx";

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
  const token = useContext(authContext).auth;

  const [editID, setEditID] = useState(-1);
  const [editValue, setEditValue] = useState<string | null>("");
  const [newTaskMessage, setNewTaskMessage] = useState<string | null>("");
  const [newTaskStatus, setNewTaskStatus] = useState<string | null>("To-Do");
  const [tasks, setTasks] = useState<Task[]>([])
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    getTasks(token).then((res) => setTasks(res))
  }, [])


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
                        <input type="text" className="bg-slate-200 border border-slate-400 pl-1 w-full" value={editValue || ""} onChange={(e) => setEditValue(e.target.value)} />
                        <button className="ml-8 mr-2" onClick={() => {
                          updateTask({ id: task.id, message: editValue || "", status: task.status }, token)
                          setEditID(-1);
                        }}>ok</button>
                      </div>
                      : <span className="pl-1">{task.message}</span>}</td>
                    <td className="text-center border-2">
                      <button className="font-bold" onClick={() => { updateTask({ id: task.id, message: task.message, status: cycleStatus(task.status, -1) }, token); setRefresh(!refresh) }}>{"<"}</button>
                      <span className={color_lookup.get(task.status)}> {task.status} </span>
                      <button className="font-bold" onClick={() => { updateTask({ id: task.id, message: task.message, status: cycleStatus(task.status, +1) }, token); setRefresh(!refresh) }}>{">"}</button>
                    </td>
                    <td className="text-center border-2">
                      <button className="mr-2" onClick={() => {
                        setEditID(i);
                        setEditValue(task.message);
                      }}>e</button>
                      <button onClick={() => {
                        deleteTask(task, token);
                        setRefresh(!refresh);
                      }}>d</button>
                    </td>
                  </tr>
                )
              })}
              <tr className="text-lg">
                <td className="border-2 flex">
                  <input type="text" className="bg-slate-200 pl-1 w-full" value={newTaskMessage || ""} onChange={(e) => setNewTaskMessage(e.target.value)} />
                </td>
                <td className="border-2 text-center">
                  <button className="font-bold" onClick={() => setNewTaskStatus(cycleStatus(newTaskStatus || "", -1))}>{"<"}</button>
                  <span className={color_lookup.get(newTaskStatus)}> {newTaskStatus} </span>
                  <button className="font-bold" onClick={() => setNewTaskStatus(cycleStatus(newTaskStatus || "", +1))}>{">"}</button>
                </td>
                <td className="border-2 text-center"><button onClick={() => {
                  addTask({ id: -1, message: newTaskMessage || "", status: newTaskStatus || "" }, token)
                  setNewTaskMessage("");
                  setNewTaskStatus("To-Do");
                }}>add</button></td>
              </tr>
            </tbody>
          </table>
          : "no tasks"}
      </Paper>
    </div>
  )
}

export default TaskList
