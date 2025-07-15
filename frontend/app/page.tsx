"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 relative">
            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-lg font-medium text-slate-200 mb-1">Loading...</h2>
          <p className="text-slate-400 text-sm">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">🛡️</span>
              </div>
              <h1 className="text-lg font-semibold text-white">CyberLearn</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/leaderboard")}
                className="text-slate-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => router.push("/account")}
                className="text-slate-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                👤 Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-5 mb-6 border border-slate-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-3 mb-3 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👋</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-0.5">
                  Welcome, {user.username}!
                </h2>
                <p className="text-slate-300 text-sm">Ready to continue learning?</p>
              </div>
            </div>
            
            {!user.premium && (
              <button
                onClick={handlePremiumUpgrade}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
              >
                ⭐ Upgrade to Premium
              </button>
            )}
            
            {user.premium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                <span className="text-amber-400 text-sm">⭐</span>
                <span className="text-amber-400 font-medium text-sm">Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium">Total Points</p>
                <p className="text-xl font-bold text-emerald-400">{user.points}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-lg">🏆</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium">Current Level</p>
                <p className="text-xl font-bold text-violet-400">{user.level}</p>
              </div>
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <span className="text-violet-400 text-lg">📈</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-medium">Courses</p>
                <p className="text-xl font-bold text-blue-400">{courses.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Available Courses</h3>
              <p className="text-slate-400 text-sm">Choose your learning path</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`group relative bg-slate-800 rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-lg ${
                  course.premium 
                    ? 'border-amber-500/30 hover:border-amber-500/50' 
                    : 'border-slate-700 hover:border-blue-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    course.premium 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <span className="text-lg">📖</span>
                  </div>
                  
                  {course.premium && (
                    <div className="flex items-center space-x-1 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded">
                      <span className="text-amber-400 text-xs">⭐</span>
                      <span className="text-amber-400 text-xs font-medium">Premium</span>
                    </div>
                  )}
                </div>
                
                <h4 className={`text-base font-medium mb-2 ${
                  course.premium ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {course.title}
                </h4>
                
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span className="text-slate-400 text-xs">Level {course.level}</span>
                  </div>
                  
                  <div className={`p-1.5 rounded-lg transition-transform group-hover:translate-x-0.5 ${
                    course.premium 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl">📚</span>
              </div>
              <h3 className="text-base font-medium text-slate-300 mb-1">No courses available</h3>
              <p className="text-slate-500 text-sm">New courses will be added soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}