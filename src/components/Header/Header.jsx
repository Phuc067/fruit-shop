export default function Header() {
  return (
    <header className=" bg-primary">
      <div className="container flex items-center">
        <div className="flex flex-col items-center justify-center w-10 h-20 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 mx-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span className="text-sm">Menu</span>
          
          <svg viewBox="0 0 20 9" role="presentation" className="w-5 appearance-none absolute bottom-1">
            <path
              d="M.47108938 9c.2694725-.26871321.57077721-.56867841.90388257-.89986354C3.12384116 6.36134886 5.74788116 3.76338565 9.2467995.30653888c.4145057-.4095171 1.0844277-.40860098 1.4977971.00205122L19.4935156 9H.47108938z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>

        <div className="w-[180px]">
          <img src="/public/logo.webp" alt="" className="w-full aspect-ratio" />
        </div>
      </div>
    </header>
  );
}
