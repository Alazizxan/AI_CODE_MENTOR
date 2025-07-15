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
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-200 mb-2">Loading Dashboard...</h2>
          <p className="text-slate-400 text-sm">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🛡️</span>
              </div>
              <h1 className="text-xl font-bold text-white">CyberLearn</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/leaderboard")}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏆 Leaderboard
              </button>
              <button
                onClick={() => router.push("/account")}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                👤 Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 mb-8 border border-slate-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {user.username}!
                </h2>
                <p className="text-slate-300 text-sm">Ready to continue your cybersecurity journey?</p>
              </div>
            </div>
            
            {!user.premium && (
              <button
                onClick={handlePremiumUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                ⭐ Upgrade to Premium
              </button>
            )}
            
            {user.premium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-lg">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="text-yellow-400 font-semibold">Premium Member</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Points</p>
                <p className="text-2xl font-bold text-green-400">{user.points}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-xl">🏆</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Current Level</p>
                <p className="text-2xl font-bold text-purple-400">{user.level}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Courses</p>
                <p className="text-2xl font-bold text-blue-400">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Available Courses</h3>
              <p className="text-slate-400">Choose your learning path and start your journey</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`group relative bg-slate-800 rounded-xl p-6 border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  course.premium 
                    ? 'border-yellow-500/30 hover:border-yellow-500/60' 
                    : 'border-slate-700 hover:border-blue-500/60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    course.premium 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <span className="text-xl">📖</span>
                  </div>
                  
                  {course.premium && (
                    <div className="flex items-center space-x-1 bg-yellow-500/20 border border-yellow-500/30 px-2 py-1 rounded-md">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-yellow-400 text-xs font-semibold">Premium</span>
                    </div>
                  )}
                </div>
                
                <h4 className={`text-lg font-semibold mb-2 ${
                  course.premium ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {course.title}
                </h4>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-400 text-xs">Level {course.level}</span>
                  </div>
                  
                  <div className={`p-2 rounded-lg transition-transform group-hover:translate-x-1 ${
                    course.premium 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No courses available</h3>
              <p className="text-slate-500 text-sm">New courses will be added soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}