interface Props {
  color: string
  helper: string
  num: number
  total: number
}

function DashboardCard({ color, num, helper, total }: Props) {
  return (
    <div className="rounded-full z-0 relative size-min bg-slate-100">
      <svg className="z-10 absolute size-full" height="20" width="20" viewBox="0 0 20 20">
        <circle className="" r="10" cx="10" cy="10" fill="transparent" />
        <circle className={color} r="5" cx="10" cy="10" fill="transparent"
          stroke-width="10"
          stroke-dasharray={`calc(${num / total * 100} * 31.4 / 100) 31.4`}
          transform="rotate(-90) translate(-20)" />
      </svg>
      <div className="z-20 m-3 bg-white relative rounded-full size-28 flex justify-center items-center flex-col">
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
