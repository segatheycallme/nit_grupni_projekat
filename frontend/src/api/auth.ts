import ky from "ky";
import { BASE_URL } from "./task";

interface Auth {
  token: string
}

async function register(username: string, email: string, password: string) {
  await ky.post(BASE_URL + "/register", { json: { username, email, password } })
}
async function login(email: string, password: string): Promise<Auth> {
  return await ky.post(BASE_URL + "/login", { json: { email, password } }).json()
}

export { register, login }
