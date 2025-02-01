import ky from "ky"

const BASE_URL = "http://localhost:3000/api"

interface Task {
  id: number,
  title: string,
  status: string,
  priority: string
}

interface User {
  email: string,
  username: string,
}

async function getUser(token: string): Promise<User> {
  return await ky.get(BASE_URL + "/user", { headers: { Authorization: "bearer " + token } }).json()
}

async function getTasks(token: string, filterText?: string, priorities?: string[], statuses?: string[]): Promise<Task[]> {
  const searchParams = { priority: (priorities || ["Low", "Medium", "High"]).join(','), status: (statuses || ["To-Do", "In Progress", "Done"]).join(',') };
  console.log(searchParams.priority)
  return await ky.get(`${BASE_URL}/tasks?search=${filterText || ''}&priority=${searchParams.priority}&status=${searchParams.status}`, { headers: { Authorization: "bearer " + token } }).json()
}
async function addTask(task: Task, token: string) {
  await ky.post(BASE_URL + "/tasks", { json: task, headers: { Authorization: "bearer " + token } })
}
async function updateTask(task: Task, token: string) {
  await ky.put(BASE_URL + "/tasks/" + task.id, { json: task, headers: { Authorization: "bearer " + token } })
}
async function deleteTask(task: Task, token: string) {
  await ky.delete(BASE_URL + "/tasks/" + task.id, { headers: { Authorization: "bearer " + token } })
}

export { getTasks, addTask, deleteTask, updateTask, type Task, BASE_URL, getUser }
