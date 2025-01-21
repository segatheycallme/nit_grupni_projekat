import ky from "ky"

const BASE_URL = "http://localhost:3001/api"

interface Task {
  id: number,
  message: string,
  status: string,
}

async function getTasks(): Promise<Task[]> {
  return await ky.get(BASE_URL + "/tasks").json()
}
async function addTask(task: Task) {
  await ky.post(BASE_URL + "/task", { json: task })
}
async function updateTask(task: Task) {
  await ky.post(BASE_URL + "/task", { json: task })
}
async function deleteTask(task: Task) {
  await ky.post(BASE_URL + "/task", { json: task })
}

export { getTasks, addTask, deleteTask, updateTask, type Task }
