import ky from "ky"

const BASE_URL = "http://localhost:3000/api"

interface Task {
  id: number,
  title: string,
  status: string,
  priority: string
}

async function getTasks(token: string): Promise<Task[]> {
  return await ky.get(BASE_URL + "/tasks", { headers: { Authorization: "bearer " + token } }).json()
}
async function addTask(task: Task, token: string) {
  await ky.post(BASE_URL + "/task", { json: task, headers: { Authorization: "bearer " + token } })
}
async function updateTask(task: Task, token: string) {
  await ky.put(BASE_URL + "/task/" + task.id, { json: task, headers: { Authorization: "bearer " + token } })
}
async function deleteTask(task: Task, token: string) {
  await ky.delete(BASE_URL + "/task/" + task.id, { headers: { Authorization: "bearer " + token } })
}

export { getTasks, addTask, deleteTask, updateTask, type Task, BASE_URL }
