"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Fix hydration error by detecting client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        const courseRes = await fetch("http://localhost:5000/api/course/list");
        const courseData = await courseRes.json();
        setCourses(courseData);
      } catch (err) {
        console.error("❌ Dashboard xatosi:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Matrix-style particles for coding theme
  const codeParticles = [
    { left: 5, top: 10, char: '{}', delay: 0.2, duration: 4 },
    { left: 15, top: 70, char: '<>', delay: 1.1, duration: 5 },
    { left: 85, top: 30, char: '()', delay: 0.7, duration: 3.5 },
    { left: 25, top: 50, char: '[]', delay: 1.8, duration: 4.5 },
    { left: 65, top: 20, char: '&&', delay: 0.4, duration: 4.2 },
    { left: 95, top: 80, char: '||', delay: 2.1, duration: 3.8 },
    { left: 45, top: 90, char: '++', delay: 1.5, duration: 5.2 },
    { left: 75, top: 60, char: '==', delay: 0.9, duration: 4.7 },
    { left: 35, top: 40, char: '!=', delay: 1.3, duration: 3.3 },
    { left: 55, top: 15, char: '=>', delay: 0.6, duration: 4.8 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background particles - Only on client */}
      {isClient && (
        <div className="absolute inset-0">
          {/* Floating code symbols */}
          {codeParticles.map((particle, i) => (
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
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-400 font-mono text-sm animate-pulse">📚</div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-indigo-400 font-mono text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>🚀</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-purple-400 font-mono text-sm animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Loading Dashboard...
          </h2>
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="w-80 h-3 mx-auto bg-slate-800 border border-blue-400/50 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse"></div>
            </div>
            <div className="text-sm text-slate-400 font-mono space-y-2">
              <p className="animate-pulse">Fetching your profile...</p>
              <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Loading available courses...</p>
              <p className="animate-pulse" style={{ animationDelay: '1s' }}>Preparing workspace...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handlePremiumUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/user/premium/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Endi siz Premium foydalanuvchisiz!");
      window.location.reload();
    } catch (error) {
      console.error("Premium upgrade error:", error);
      alert("❌ Xatolik yuz berdi. Qaytadan urining.");
    }
  };

  const handleCourseClick = (course: any) => {
    if (course.premium && !user.premium) {
      alert("⛔ Ushbu kurs Premium foydalanuvchilar uchun!");
      return;
    }
    router.push(`/course/${course._id}/details`);
  };

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
                {['{}', '<>', '()', '[]', '&&', '||', '++', '==', '!=', '=>', '<=', '>='][i]}
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
              className="absolute text-indigo-400/40 font-mono text-lg animate-bounce"
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
        <div className="max-w-7xl mx-auto">
          {/* User Welcome Header */}
          <div className="mb-8 md:mb-12 p-6 sm:p-8 md:p-10 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-400/10 relative overflow-hidden">
            {/* Header effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-indigo-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-start space-x-4 md:space-x-6">
                  {/* Profile Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-700 border border-blue-400/50 flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="text-2xl md:text-3xl">👋</div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {/* Welcome message */}
                    <div className="mb-3">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 leading-tight">
                        Welcome back, {user.username}!
                      </h1>
                      {user.premium && (
                        <div className="inline-flex items-center mt-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-xl backdrop-blur-sm">
                          <span className="text-yellow-400 text-lg mr-2">⭐</span>
                          <span className="font-mono font-bold text-yellow-400 text-sm md:text-base">Premium Member</span>
                        </div>
                      )}
                    </div>
                    
                    {/* User stats */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                      <div className="flex items-center space-x-2 bg-slate-700/60 border border-green-400/30 px-3 md:px-4 py-2 rounded-lg shadow-sm">
                        <div className="w-8 h-8 rounded bg-green-400/20 border border-green-400/40 flex items-center justify-center">
                          <span className="text-green-400 text-sm">🏆</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-slate-400 font-mono">Points</div>
                          <div className="font-mono font-bold text-green-400">{user.points}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-slate-700/60 border border-purple-400/30 px-3 md:px-4 py-2 rounded-lg shadow-sm">
                        <div className="w-8 h-8 rounded bg-purple-400/20 border border-purple-400/40 flex items-center justify-center">
                          <span className="text-purple-400 text-sm">🪜</span>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-slate-400 font-mono">Level</div>
                          <div className="font-mono font-bold text-purple-400">{user.level}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Premium upgrade button */}
                {!user.premium && (
                  <div className="lg:flex-shrink-0">
                    <button
                      onClick={handlePremiumUpgrade}
                      className="group w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-mono font-bold text-sm md:text-base transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40 hover:scale-105 hover:-translate-y-1 flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                      <span className="text-xl mr-2">⭐</span>
                      <span className="relative z-10">Upgrade to Premium</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="mb-8">
            <div className="flex items-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-700 border border-indigo-400/50 flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl md:text-3xl">📚</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">
                  Available Courses
                </h2>
                <p className="text-slate-400 font-mono text-sm md:text-base mt-1">
                  Choose your learning path and start coding!
                </p>
              </div>
            </div>
            
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCourseClick(course)}
                  className={`group relative p-6 md:p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl overflow-hidden ${
                    course.premium 
                      ? 'bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border-yellow-400/30 hover:border-yellow-400/60 shadow-yellow-400/10 hover:shadow-yellow-400/20'
                      : 'bg-slate-800/80 border-blue-400/30 hover:border-blue-400/60 shadow-blue-400/10 hover:shadow-blue-400/20'
                  }`}
                >
                  {/* Card effects */}
                  <div className={`absolute inset-0 ${
                    course.premium 
                      ? 'bg-gradient-to-br from-yellow-400/5 to-orange-400/5'
                      : 'bg-gradient-to-br from-blue-400/5 to-indigo-400/5'
                  } transition-opacity duration-300 group-hover:opacity-75`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border flex items-center justify-center shadow-md ${
                        course.premium 
                          ? 'bg-yellow-400/20 border-yellow-400/40'
                          : 'bg-blue-400/20 border-blue-400/40'
                      }`}>
                        <span className="text-xl md:text-2xl">📖</span>
                      </div>
                      
                      {course.premium && (
                        <div className="flex items-center space-x-1 px-2 md:px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-lg backdrop-blur-sm">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-yellow-400 font-mono font-bold text-xs">Premium</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className={`text-xl md:text-2xl font-mono font-bold mb-3 md:mb-4 ${
                      course.premium ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {course.title}
                    </h3>
                    
                    <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-2 px-3 py-1.5 border rounded-lg ${
                        course.premium 
                          ? 'bg-yellow-400/10 border-yellow-400/30'
                          : 'bg-blue-400/10 border-blue-400/30'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-slate-300 font-mono text-xs md:text-sm">
                          Level: {course.level}
                        </span>
                      </div>
                      
                      <div className={`p-2 rounded-lg transition-transform group-hover:translate-x-1 duration-300 ${
                        course.premium 
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-blue-400/20 text-blue-400'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Hover effect indicator */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty state */}
            {courses.length === 0 && (
              <div className="text-center py-12 md:py-16">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-800/60 border border-blue-400/30 flex items-center justify-center mb-6">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl md:text-2xl font-mono font-bold text-slate-400 mb-2">
                  No courses available yet
                </h3>
                <p className="text-slate-500 font-mono text-sm md:text-base">
                  New courses will appear here soon!
                </p>
              </div>
            )}
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