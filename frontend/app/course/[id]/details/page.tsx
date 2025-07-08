"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Fix hydration error by detecting client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/course/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Kurs topilmadi yoki xatolik yuz berdi.");
        }

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("❌ Kursni yuklashda xatolik:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  // Matrix-style particles for coding theme
  const codeParticles = [
    { left: 8, top: 15, char: '📝', delay: 0.3, duration: 4.2 },
    { left: 20, top: 75, char: '🎥', delay: 1.2, duration: 5.1 },
    { left: 80, top: 35, char: '📖', delay: 0.8, duration: 3.7 },
    { left: 30, top: 55, char: '🚀', delay: 1.9, duration: 4.6 },
    { left: 70, top: 25, char: '⭐', delay: 0.5, duration: 4.3 },
    { left: 90, top: 85, char: '💡', delay: 2.2, duration: 3.9 },
    { left: 50, top: 90, char: '🎯', delay: 1.6, duration: 5.3 },
    { left: 75, top: 65, char: '🔥', delay: 1.0, duration: 4.8 },
    { left: 40, top: 45, char: '⚡', delay: 1.4, duration: 3.4 },
    { left: 60, top: 20, char: '🌟', delay: 0.7, duration: 4.9 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background particles - Only on client */}
      {isClient && (
        <div className="absolute inset-0">
          {/* Floating course symbols */}
          {codeParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-blue-400 font-mono text-lg opacity-40 animate-bounce"
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
          <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-800/80 border border-blue-400/50 shadow-lg shadow-blue-400/20 flex items-center justify-center backdrop-blur-sm">
            <div className="relative">
              {/* Main spinner */}
              <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
              {/* Inner spinner */}
              <div className="absolute inset-2 w-8 h-8 border-2 border-indigo-400 border-b-transparent border-l-transparent rounded-full animate-spin reverse"></div>
              {/* Center dot */}
              <div className="absolute inset-1/2 w-3 h-3 bg-blue-400 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Glow effects */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-blue-400/20 blur-xl animate-pulse"></div>
          
          {/* Orbiting elements */}
          {isClient && (
            <div className="absolute inset-0 w-40 h-40 mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-400 font-mono text-lg animate-pulse">📖</div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-indigo-400 font-mono text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>📝</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-purple-400 font-mono text-lg animate-pulse" style={{ animationDelay: '1s' }}>🎥</div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Loading Course Details...
          </h2>
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="w-80 h-3 mx-auto bg-slate-800 border border-blue-400/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse"></div>
            </div>
            <div className="text-sm text-slate-400 font-mono space-y-2">
              <p className="animate-pulse">Fetching course information...</p>
              <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Loading tasks and lessons...</p>
              <p className="animate-pulse" style={{ animationDelay: '1s' }}>Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-800/60 border border-red-400/40 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-2xl font-mono font-bold text-red-400 mb-4">Course Not Found</h2>
        <p className="text-slate-400 font-mono mb-6">Kurs topilmadi yoki mavjud emas</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-slate-700 border border-blue-400/30 hover:border-blue-400 text-blue-400 rounded-xl font-mono transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

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
                {['📝', '🎥', '📖', '🚀', '⭐', '💡', '🎯', '🔥', '⚡', '🌟', '✨', '💻'][i]}
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
          {codeParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-indigo-400/40 font-mono text-2xl animate-bounce"
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

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Course Header */}
          <div className="mb-8 md:mb-12 p-6 sm:p-8 md:p-10 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-400/10 relative overflow-hidden">
            {/* Header effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-indigo-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-start space-x-4 md:space-x-6">
                  {/* Course Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-700 border border-blue-400/50 flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="text-2xl md:text-3xl">📖</div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {/* Course title */}
                    <div className="mb-3">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 leading-tight">
                        {course.title}
                      </h1>
                      {course.premium && (
                        <div className="inline-flex items-center mt-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-xl backdrop-blur-sm">
                          <span className="text-yellow-400 text-lg mr-2">⭐</span>
                          <span className="font-mono font-bold text-yellow-400 text-sm md:text-base">Premium Course</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Course description */}
                    <p className="text-slate-300 font-mono text-sm md:text-base lg:text-lg leading-relaxed bg-slate-700/40 border border-indigo-400/20 rounded-lg p-4">
                      {course.description}
                    </p>
                  </div>
                </div>
                
                {/* Back button */}
                <div className="lg:flex-shrink-0">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="group w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-slate-700/60 border border-red-400/40 hover:border-red-400 text-red-400 hover:text-red-300 font-mono font-bold text-sm md:text-base transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative z-10">Back to Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Options */}
          <div className="mb-8">
            <div className="flex items-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-700 border border-indigo-400/50 flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl md:text-3xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">
                  Choose Your Path
                </h2>
                <p className="text-slate-400 font-mono text-sm md:text-base mt-1">
                  Start with tasks or watch video lessons first
                </p>
              </div>
            </div>
            
            {/* Course Options Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Tasks Card */}
              <div
                onClick={() => router.push(`/course/${course._id}/`)}
                className="group relative p-6 md:p-8 lg:p-10 rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-400/30 hover:border-blue-400/60 shadow-lg shadow-blue-400/10 hover:shadow-blue-400/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Card effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 transition-opacity duration-300 group-hover:opacity-75"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-400/20 border border-blue-400/40 flex items-center justify-center shadow-lg">
                      <span className="text-3xl md:text-4xl">📝</span>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-blue-400/20 text-blue-400 transition-transform group-hover:translate-x-2 duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-mono font-bold text-blue-400 mb-4">
                    Practice Tasks
                  </h3>
                  
                  <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed mb-6">
                    Kursdagi barcha vazifalarni bajarish uchun bosing. Har bir vazifa sizning coding skilllaringizni oshiradi.
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-slate-300 font-mono text-xs md:text-sm">Interactive</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-400/10 border border-indigo-400/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-slate-300 font-mono text-xs md:text-sm">Hands-on</span>
                    </div>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              {/* Video Lessons Card */}
              <div
                onClick={() => router.push(`/course/${course._id}/lessons`)}
                className="group relative p-6 md:p-8 lg:p-10 rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-400/30 hover:border-green-400/60 shadow-lg shadow-green-400/10 hover:shadow-green-400/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Card effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 transition-opacity duration-300 group-hover:opacity-75"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-green-400/20 border border-green-400/40 flex items-center justify-center shadow-lg">
                      <span className="text-3xl md:text-4xl">🎥</span>
                    </div>
                    
                    <div className="p-3 rounded-xl bg-green-400/20 text-green-400 transition-transform group-hover:translate-x-2 duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-mono font-bold text-green-400 mb-4">
                    Video Lessons
                  </h3>
                  
                  <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed mb-6">
                    Kursdagi barcha video darslarni ko'rish uchun bosing. Professional instructorlardan o'rganing.
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-slate-300 font-mono text-xs md:text-sm">HD Quality</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      <span className="text-slate-300 font-mono text-xs md:text-sm">Step by Step</span>
                    </div>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      {/* CSS Animations */}
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