interface Props {
  color: string
  helper: string
  num: number
}

function DashboardCard({ color, num, helper }: Props) {
  return (
    <div className={"rounded-full p-3 size-min " + color}>
      <div className="bg-slate-100 rounded-full size-28 flex justify-center items-center flex-col">
        <span className="text-3xl font-bold text-slate-400">
          {num}
        </span>
        <span className="text-lg font-bold text-slate-300">
          {helper}
        </span>
      </div>
    </div>
  )
}

export default DashboardCard
