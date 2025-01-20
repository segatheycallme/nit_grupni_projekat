import { ReactNode } from "react"

interface Interfejs {
  children: ReactNode
  className?: string
}

export default function Paper({ children, className }: Interfejs) {
  return (
    <div className={"bg-slate-50 shadow-lg p-2 m-1 " + className}>{children}</div>
  )
}

