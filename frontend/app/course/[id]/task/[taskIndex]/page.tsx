"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskPage() {
  const [course, setCourse] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isClient, setIsClient] = useState(false);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();

  // Fix hydration error by detecting client-side
  useEffect(() => {
    setIsClient(true);
    // Generate matrix characters
    const chars = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', '{', '}', '<', '>', '(', ')', '[', ']', '/', '\\', '|', '-', '_', '=', '+', '*', '#', '@', '$', '%', '&'];
    setMatrixChars(chars);
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const foundCourse = data.find((c: any) => c._id === params.id);

        if (!foundCourse) return router.push("/dashboard");

        setCourse(foundCourse);
        setTask(foundCourse.tasks[Number(params.taskIndex)]);
      } catch (error) {
        console.error("Kursni yuklashda xatolik:", error);
      }
    };

    fetchTask();
  }, []);

  // Update line numbers and cursor position when code changes
  useEffect(() => {
    const lines = code.split('\n');
    const lineCount = Math.max(lines.length, 20);
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => i + 1));
    
    // Simulate cursor position tracking
    const lastLine = lines.length;
    const lastColumn = lines[lines.length - 1]?.length || 0;
    setCursorPosition({ line: lastLine, column: lastColumn + 1 });
  }, [code]);

  // Typing indicator
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/course/submit/${params.id}/${params.taskIndex}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      setFeedback(data.feedback);
      setSubmitted(true);
    } catch (error) {
      console.error("Kod yuborishda xatolik:", error);
      setFeedback("❌ Kodni yuborishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Retry function
  const handleRetry = () => {
    setSubmitted(false);
    setFeedback("");
    setCode("");
  };

  // Matrix-style particles for coding theme
  const matrixParticles = [
    { left: 5, top: 10, char: '0', delay: 0.2, duration: 3 },
    { left: 15, top: 70, char: '1', delay: 1.1, duration: 4 },
    { left: 85, top: 30, char: 'A', delay: 0.7, duration: 3.5 },
    { left: 25, top: 50, char: 'F', delay: 1.8, duration: 5 },
    { left: 65, top: 20, char: '{', delay: 0.4, duration: 4.2 },
    { left: 95, top: 80, char: '}', delay: 2.1, duration: 3.8 },
    { left: 45, top: 90, char: '<', delay: 1.5, duration: 5.2 },
    { left: 75, top: 60, char: '>', delay: 0.9, duration: 4.7 },
    { left: 35, top: 40, char: '#', delay: 1.3, duration: 3.3 },
    { left: 55, top: 15, char: '@', delay: 0.6, duration: 4.8 },
  ];

  if (!task) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background particles - Only on client */}
      {isClient && (
        <div className="absolute inset-0">
          {/* Floating code symbols */}
          {matrixParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-blue-400 font-mono text-xs opacity-40 animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.char}
            </div>
          ))}
          
          {/* Simple gradient lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-blue-400 to-transparent animate-pulse"
                style={{
                  left: `${(i + 1) * 6.67}%`,
                  height: '100%',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center relative z-10">
        <div className="relative mb-8">
          {/* Modern loading container */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-800/80 border border-blue-400/50 shadow-lg shadow-blue-400/20 flex items-center justify-center backdrop-blur-sm">
            <div className="relative">
              {/* Main spinner */}
              <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
              {/* Inner spinner */}
              <div className="absolute inset-2 w-6 h-6 border-2 border-indigo-400 border-b-transparent border-l-transparent rounded-full animate-spin reverse"></div>
              {/* Center dot */}
              <div className="absolute inset-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Glow effects */}
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-blue-400/20 blur-xl animate-pulse"></div>
          
          {/* Orbiting elements */}
          {isClient && (
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-400 font-mono text-xs animate-pulse">01</div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-indigo-400 font-mono text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>10</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-purple-400 font-mono text-xs animate-pulse" style={{ animationDelay: '1s' }}>11</div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Loading Task Environment...
          </h2>
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="w-64 h-3 mx-auto bg-slate-800 border border-blue-400/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse"></div>
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-1">
              <p className="animate-pulse">Initializing coding environment...</p>
              <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Loading your mission...</p>
              <p className="animate-pulse" style={{ animationDelay: '1s' }}>Almost ready...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 relative overflow-hidden">
      {/* Background Effects - Only on client */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-blue-400/30 font-mono text-xs"
                style={{
                  left: `${(i + 1) * 8}%`,
                  top: '0%',
                  animation: `float-down ${5 + (i % 2)}s linear infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {matrixChars[i % matrixChars.length]}
              </div>
            ))}
          </div>
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
          
          {/* Floating symbols */}
          {matrixParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-indigo-400/40 font-mono text-sm animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.char}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Modern Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 md:mb-10 p-4 sm:p-6 md:p-8 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-400/10 relative overflow-hidden">
            {/* Header effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-indigo-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
            
            <div className="mb-4 xl:mb-0 relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-700 border border-blue-400/50 flex items-center justify-center mr-3 md:mr-4 shadow-md">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-blue-400 tracking-wider">CODING SESSION</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-4 leading-tight">
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-slate-400 text-xs md:text-sm">
                <div className="flex items-center space-x-2 font-mono bg-slate-700/60 border border-blue-400/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-blue-400/20 border border-blue-400/40 flex items-center justify-center">
                    <span className="text-xs md:text-sm text-blue-400">📚</span>
                  </div>
                  <span className="text-slate-200 text-xs md:text-sm">{course.title}</span>
                </div>
                <div className="hidden sm:block w-px h-4 md:h-6 bg-blue-400/30"></div>
                <div className="flex items-center space-x-2 font-mono bg-slate-700/60 border border-indigo-400/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-indigo-400/20 border border-indigo-400/40 flex items-center justify-center">
                    <span className="text-xs md:text-sm text-indigo-400">🎯</span>
                  </div>
                  <span className="text-slate-200 text-xs md:text-sm">Task {Number(params.taskIndex) + 1} of {course.tasks.length}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="group relative px-4 md:px-8 py-2 md:py-4 rounded-xl bg-slate-700/60 border border-red-400/40 hover:border-red-400 text-red-400 hover:text-red-300 font-mono text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center whitespace-nowrap backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="relative z-10">Back to Course</span>
            </button>
          </div>

          {/* Task Description */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-10 border border-indigo-400/30 shadow-lg relative overflow-hidden">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px)`,
            }}></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 relative z-10">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-indigo-400/50 bg-slate-700 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-mono font-bold text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 mb-3 md:mb-4">
                  Task Description
                </h2>
                <div className="text-slate-300 font-mono leading-relaxed text-sm md:text-base lg:text-lg bg-slate-700/40 border border-indigo-400/20 rounded-lg p-4">
                  <span className="text-blue-400">💡 Mission:</span> <span className="text-slate-200">{task.description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative mb-6 md:mb-10 rounded-2xl overflow-hidden shadow-lg border border-blue-400/30 group">
            {/* Editor glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            {/* Editor Header */}
            <div className="relative bg-slate-800 border-b border-blue-400/30 px-4 md:px-8 py-3 md:py-5 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center space-x-3 md:space-x-6">
                {/* Window controls */}
                <div className="flex space-x-2 md:space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-400 shadow-sm"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-400 shadow-sm"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-400 shadow-sm"></div>
                </div>
                
                {/* File info */}
                <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-400 animate-pulse' : 'bg-slate-500'} transition-colors`}></div>
                    <span className="text-blue-400">solution.js</span>
                  </div>
                  <div className="hidden lg:flex items-center space-x-2 md:space-x-4">
                    <span className="bg-slate-700 border border-blue-400/30 px-2 md:px-3 py-1 rounded text-blue-400">UTF-8</span>
                    <span className="bg-slate-700 border border-indigo-400/30 px-2 md:px-3 py-1 rounded text-indigo-400">JS</span>
                    <span className="bg-slate-700 border border-purple-400/30 px-2 md:px-3 py-1 rounded text-purple-400">{code.length} chars</span>
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <span>Line {cursorPosition.line}, Col {cursorPosition.column}</span>
                </div>
              </div>
            </div>
            
            {/* Code Editor Container */}
            <div className="relative bg-slate-900">
              <div className="flex">
                {/* Line Numbers */}
                <div className="flex-shrink-0 bg-slate-800 border-r border-blue-400/20 px-2 md:px-6 py-4 md:py-8 text-right">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className={`font-mono text-xs md:text-sm leading-6 md:leading-7 select-none transition-colors ${
                        num === cursorPosition.line 
                          ? 'text-blue-400 font-bold' 
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Code Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Welcome to your coding environment! 
// Write your solution here...
// Tips: Use proper indentation and clear variable names

function solution() {
  // Your code goes here
  
}

// Good luck! 🚀`}
                    className={`w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] font-mono text-slate-100 bg-slate-900 p-3 md:p-8 focus:outline-none resize-none placeholder-slate-500 leading-6 md:leading-7 text-xs md:text-sm transition-all duration-300 ${
                      submitted ? 'opacity-70 cursor-not-allowed' : 'focus:bg-slate-900/80'
                    }`}
                    disabled={submitted}
                    spellCheck={false}
                    style={{
                      caretColor: '#60a5fa'
                    }}
                  />
                  
                  {/* Code grid overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                      backgroundSize: '100% 1.5rem'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Editor Footer */}
              <div className="bg-slate-800 border-t border-blue-400/20 px-3 md:px-8 py-2 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono backdrop-blur-xl space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 md:space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">Live Session</span>
                  </div>
                  <span className="text-blue-400">Lines: {code.split('\n').length}</span>
                  <span className="hidden sm:inline text-indigo-400">Words: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-4 md:space-x-6 text-slate-400">
                  <span>Auto-save: ON</span>
                  <span>Syntax: JavaScript</span>
                  <span>Theme: Dark</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-6 md:mb-10">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-6 md:px-12 py-3 md:py-6 rounded-2xl font-mono font-bold text-base md:text-xl transition-all duration-500 ${
                  loading 
                    ? 'bg-slate-700 border border-slate-600 cursor-wait text-slate-400' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1'
                } flex items-center justify-center min-w-[200px] md:min-w-[280px] overflow-hidden`}
              >
                {/* Button effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                <div className="relative flex items-center space-x-3 md:space-x-4">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-5 h-5 md:w-6 md:h-6 border-2 border-blue-400 border-b-transparent rounded-full animate-spin reverse"></div>
                      </div>
                      <span>Checking Your Code...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Submit Solution</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Feedback Terminal */}
          {feedback && (
            <div className={`rounded-2xl overflow-hidden border shadow-lg relative ${
              feedback.includes("✅") 
                ? 'border-green-400/40 shadow-green-400/20' 
                : 'border-red-400/40 shadow-red-400/20'
            }`}>
              {/* Glow effects */}
              <div className={`absolute inset-0 rounded-2xl ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-green-400/10 to-emerald-400/10' 
                  : 'bg-gradient-to-r from-red-400/10 to-orange-400/10'
              } blur-xl`}></div>
              
              {/* Terminal Header */}
              <div className={`relative px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-800 backdrop-blur-xl border-b space-y-4 sm:space-y-0 ${
                feedback.includes("✅") 
                  ? 'border-green-400/30' 
                  : 'border-red-400/30'
              }`}>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border flex items-center justify-center shadow-md relative ${
                    feedback.includes("✅") 
                      ? 'border-green-400/50 bg-slate-700' 
                      : 'border-red-400/50 bg-slate-700'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 md:h-8 md:w-8 ${
                      feedback.includes("✅") ? 'text-green-400' : 'text-red-400'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feedback.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-lg md:text-2xl mb-2">
                      {feedback.includes("✅") ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                          ✅ Success!
                        </span>
                      ) : (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                          ❌ Try Again
                        </span>
                      )}
                    </h3>
                    <p className="text-xs md:text-sm font-mono text-slate-400">
                      Code execution completed at {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono flex items-center bg-slate-700/60 border px-3 md:px-4 py-1.5 md:py-2 rounded-lg backdrop-blur-xl space-x-2 border-blue-400/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400">Status: Complete</span>
                </div>
              </div>
              
              {/* Feedback Content */}
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-slate-900 backdrop-blur-xl relative">
                <div className={`font-mono text-xs md:text-sm leading-relaxed p-4 md:p-6 rounded-xl border relative ${
                  feedback.includes("✅") 
                    ? 'bg-slate-800/60 border-green-400/30 text-green-100' 
                    : 'bg-slate-800/60 border-red-400/30 text-red-100'
                }`}>
                  {/* Terminal prompt */}
                  <div className="flex items-start space-x-2 mb-3">
                    <span className={feedback.includes("✅") ? 'text-green-400' : 'text-red-400'}>
                      test@result:~$
                    </span>
                    <div className="w-2 h-4 bg-blue-400 animate-pulse"></div>
                  </div>
                  
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {feedback}
                  </pre>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mt-6 md:mt-10">
                  <button
                    onClick={() => router.push(`/course/${params.id}`)}
                    className="group px-4 md:px-8 py-2 md:py-4 rounded-xl bg-slate-700/60 border border-blue-400/30 hover:border-blue-400 text-blue-400 hover:text-blue-300 font-mono text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative z-10">Back to Tasks</span>
                  </button>
                  
                  {/* Retry Button - only show if there's an error */}
                  {!feedback.includes("✅") && (
                    <button
                      onClick={handleRetry}
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-xl bg-slate-700/60 border border-yellow-400/30 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 font-mono text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:rotate-180 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="relative z-10">Try Again</span>
                    </button>
                  )}
                  
                  {hasNextTask && feedback.includes("✅") && (
                    <button
                      onClick={() =>
                        router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                      }
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-xl bg-slate-700/60 border border-green-400/30 hover:border-green-400 text-green-400 hover:text-green-300 font-mono text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="relative z-10">Next Task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3 transition-transform group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  
                  {!hasNextTask && feedback.includes("✅") && (
                    <button
                      onClick={() => router.push(`/course/${params.id}`)}
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-xl bg-slate-700/60 border border-purple-400/30 hover:border-purple-400 text-purple-400 hover:text-purple-300 font-mono text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative z-10">Complete Course</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
       
       {/* Simplified CSS Animations */}
       <style jsx>{`
         @keyframes float-down {
           0% { transform: translateY(-100vh); opacity: 0; }
           10% { opacity: 0.6; }
           90% { opacity: 0.6; }
           100% { transform: translateY(100vh); opacity: 0; }
         }
         
         .reverse {
           animation-direction: reverse;
         }
         
         /* Custom scrollbar */
         ::-webkit-scrollbar {
           width: 8px;
         }
         ::-webkit-scrollbar-track {
           background: #1e293b;
         }
         ::-webkit-scrollbar-thumb {
           background: #60a5fa;
           border-radius: 4px;
         }
         ::-webkit-scrollbar-thumb:hover {
           background: #3b82f6;
         }
       `}</style>
     </div>
   );
 }