export default function UserInformation({ info, rol }) {
  return (
    <>
      <div className="sm:hidden flex items-center space-x-2 bg-emerald-800/85 backdrop-blur-md px-3 py-2 rounded-lg border border-emerald-600/60 shadow-sm">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-3 h-3 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <span className="text-white text-xs font-semibold tracking-wide">
          {info}
        </span>
      </div>

      <div className="hidden lg:flex items-center space-x-3 bg-emerald-800/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-600/60 shadow-lg">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div className="text-white">
          <p className="text-sm font-semibold tracking-wide">{info}</p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-emerald-100 font-medium">{rol}</p>
          </div>
        </div>
      </div>
    </>
  );
}
