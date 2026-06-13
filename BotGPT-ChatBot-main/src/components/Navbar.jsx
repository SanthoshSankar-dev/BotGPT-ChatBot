import React from 'react'
import { FaRobot, FaSun, FaMoon } from "react-icons/fa6";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav className={`transition-theme sticky top-0 z-50 w-full h-[80px] md:h-[100px] flex items-center justify-between px-5 md:px-20 lg:px-40 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white border-b border-gray-800' : 'bg-white text-black border-b border-gray-200'}`}>
      <div className="logo flex items-center gap-3">
        <i className='text-3xl md:text-5xl text-purple-500'><FaRobot /></i>
        <h3 className='text-xl md:text-2xl font-bold'>Bot<span className='text-purple-500'>GPT</span></h3>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-zinc-800 text-yellow-400' : 'bg-gray-100 text-zinc-600'}`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        <div className="user cursor-pointer">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <span className="font-semibold text-sm">JS</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar