"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Foydalanuvchini olishda xato:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400">Foydalanuvchi topilmadi</p>
      </div>
    );
  }

  // Level aniqlash
  const levelTitle =
    user.level < 5 ? "👶 Beginner" : user.level < 10 ? "💻 Intermediate" : "🚀 Expert";

  // Chart configurations with dark theme
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    }
  };

  // Kurs progress barlar uchun data
  const barData = {
    labels: user.courses.map((c: any) => c.title),
    datasets: [
      {
        label: "Progress (%)",
        data: user.courses.map(
          (c: any) => (c.completedTasks.length / c.totalTasks) * 100
        ),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Ballar distribution uchun data
  const doughnutData = {
    labels: ["Completed Points", "Remaining Points"],
    datasets: [
      {
        data: [user.points, 1000 - user.points],
        backgroundColor: ["#3b82f6", "#1e293b"],
        borderColor: ["#60a5fa", "#334155"],
        borderWidth: 2,
      },
    ],
  };

  // Kunlik ball progress (mock data)
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Points",
        data: [5, 10, 15, 20, 30, 40, user.points],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🛡️</span>
              </div>
              <h1 className="text-xl font-bold text-white">CyberLearn Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Home
              </button>
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
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 mb-8 border border-slate-600">
          <h1 className="text-3xl font-bold text-white mb-2">👋 Welcome, {user.username}</h1>
          <p className="text-slate-300">Here's your learning progress overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Your Stats</h2>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">📊</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Level:</span>
                <span className="text-blue-400 font-bold">{user.level} ({levelTitle})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Points:</span>
                <span className="text-green-400 font-bold">{user.points}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Progress Overview</h2>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-lg">🎯</span>
              </div>
            </div>
            <div className="h-48">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">📚 Course Progress</h2>
          <div className="space-y-4">
            {user.courses.map((c: any) => {
              const percent = c.totalTasks > 0 ? (c.completedTasks / c.totalTasks) * 100 : 0;
              const badge = percent < 25 ? "🔥 Beginner" : percent < 75 ? "💻 Intermediate" : "🚀 Expert";

              return (
                <div key={c._id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">{c.title}</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {badge}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      {c.completedTasks.length}/{c.totalTasks} tasks completed
                    </span>
                    <button
                      onClick={() => router.push(`/course/${c._id}`)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">📈 Daily Progress</h2>
            <div className="h-64">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">📊 Course Performance</h2>
            <div className="h-64">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">🏅 Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.topUsers.map((u: any, i: number) => (
              <div key={i} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-yellow-500 text-yellow-900' :
                    i === 1 ? 'bg-gray-400 text-gray-900' :
                    i === 2 ? 'bg-orange-600 text-orange-100' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{u.username}</p>
                    <p className="text-sm text-slate-400">⭐ {u.points} points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}