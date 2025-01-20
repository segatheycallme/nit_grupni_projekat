import Paper from "../components/Paper"

interface Task {
  message: string
  status: string
}

const tasks: Task[] | null =
  [
    { message: "do the laundry", status: "To-Do" },
    { message: "do the bed", status: "To-Do" },
    { message: "do the clock", status: "To-Do" },
    { message: "do the radiator", status: "To-Do" },
  ]

function TaskList() {
  return (
    <div className="flex items-center justify-center h-full">
      <Paper className="h-3/4 w-full sm:w-3/4">
        {tasks ?
          <table className="w-full">
            <tr>
              <th>Task message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            {tasks.map((task) => {
              return (
                <tr className="">
                  <td className="w-4/5">{task.message}</td>
                  <td className="w-1/6 text-center">
                    <button className="font-bold">{"<"}</button>
                    <span> {task.status} </span>
                    <button className="font-bold">{">"}</button></td>
                  <td className="text-center">e</td>
                </tr>
              )
            })}
          </table>
          : "no tasks"}
      </Paper>
    </div>
  )
}

export default TaskList
