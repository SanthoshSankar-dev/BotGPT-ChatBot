import React, { useState, useEffect } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import { GoogleGenAI } from "@google/genai";
import { BeatLoader } from "react-spinners";
import Markdown from 'react-markdown'
import { RiComputerFill } from "react-icons/ri";
import { GiOpenBook, GiWhiteBook } from 'react-icons/gi';
import { FaBloggerB, FaPaperPlane } from 'react-icons/fa';
const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [screen, setScreen] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  async function getResponse() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
      alert("Missing Gemini API Key! Please add it to your .env file and restart the server.");
      return;
    }

    if (prompt.trim() === "") {
      return;
    }

    const userMessage = { role: "user", content: prompt };
    setData(prevData => [...prevData, userMessage]);
    setPrompt("");
    setScreen(2);
    setLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: apiKey });
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response.candidates[0].content.parts[0].text;
      setData(prevData => [...prevData, { role: "ai", content: text }]);
    } catch (error) {
      console.error("API Error:", error);
      setData(prevData => [...prevData, { role: "ai", content: "Sorry, I encountered an error. Please check your API key and connection." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    { icon: <RiComputerFill />, text: "Create a website using html css and js." },
    { icon: <GiWhiteBook />, text: "Write a book for me. topic is coding." },
    { icon: <GiOpenBook />, text: "Tell me a comedy story." },
    { icon: <FaBloggerB />, text: "Create a blog for me topic is web dev." },
  ];

  return (
    <div className={`min-h-screen transition-theme ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex flex-col items-center w-full max-w-7xl mx-auto px-5 md:px-20 lg:px-40 pb-32">
        {screen === 1 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className='text-4xl md:text-6xl font-extrabold mb-8'>
              Bot<span className='text-purple-500'>GPT</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setPrompt(s.text); }}
                  className={`p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800' : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
                >
                  <i className='text-3xl text-purple-500 mb-3 block'>{s.icon}</i>
                  <p className='text-sm md:text-base font-medium'>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 mt-8">
            {data.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col p-5 rounded-2xl max-w-[85%] md:max-w-[70%] transition-theme ${item.role === "user"
                  ? `self-end ${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white shadow-md'}`
                  : `self-start ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200 shadow-sm'}`
                  }`}
              >
                <span className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${item.role === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                  {item.role === "user" ? "You" : "BotGPT"}
                </span>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="self-start p-5 rounded-2xl bg-zinc-900/50 flex items-center gap-2">
                <BeatLoader size={8} color={theme === 'dark' ? '#fff' : '#a855f7'} />
              </div>
            )}
          </div>
        )}
      </main>

      <div className={`fixed bottom-0 left-0 w-full p-5 md:p-8 ${theme === 'dark' ? 'bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent' : 'bg-gradient-to-t from-gray-50 via-gray-50 to-transparent'}`}>
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <div className={`flex items-center gap-3 p-2 pl-5 rounded-2xl transition-theme ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 shadow-2xl' : 'bg-white border border-gray-200 shadow-lg'}`}>
            <input
              onKeyDown={(e) => { if (e.key === "Enter") getResponse(); }}
              onChange={(e) => { setPrompt(e.target.value) }}
              value={prompt}
              type="text"
              placeholder='Ask BotGPT anything...'
              className='flex-1 bg-transparent py-3 outline-none text-base md:text-lg font-medium'
            />
            <button
              onClick={getResponse}
              className="bg-purple-600 hover:bg-purple-500 text-white p-3.5 rounded-xl transition-all active:scale-95"
            >
              <FaPaperPlane />
            </button>
          </div>
          <p className='text-[10px] md:text-xs text-center text-gray-500 uppercase tracking-widest font-semibold'>
            BotGPT can make mistakes. Cross check important info.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App;