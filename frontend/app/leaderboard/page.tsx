"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/leaderboard");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("❌ Leaderboard olishda xato:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-500 to-orange-500";
      case 1: return "from-gray-400 to-gray-600";
      case 2: return "from-orange-600 to-red-600";
      default: return "from-blue-500 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏆</span>
              </div>
              <h1 className="text-xl font-bold text-white">Leaderboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                📊 Dashboard
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-slate-400">Top performers in cybersecurity learning</p>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="flex justify-center items-end space-x-4 mb-12">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mb-3">
                <span className="text-white text-2xl">🥈</span>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 min-w-[120px]">
                <h3 className="font-bold text-white text-sm">{users[1].username}</h3>
                <p className="text-gray-400 text-xs">{users[1].points} pts</p>
                <p className="text-gray-400 text-xs">Level {users[1].level}</p>
              </div>
              <div className="w-full h-16 bg-gradient-to-t from-gray-400 to-gray-600 mt-2 rounded-t-lg"></div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white text-3xl">🥇</span>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-yellow-500/30 min-w-[120px]">
                <h3 className="font-bold text-white">{users[0].username}</h3>
                <p className="text-yellow-400 text-sm">{users[0].points} pts</p>
                <p className="text-yellow-400 text-sm">Level {users[0].level}</p>
              </div>
              <div className="w-full h-20 bg-gradient-to-t from-yellow-500 to-orange-500 mt-2 rounded-t-lg"></div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-3">
                <span className="text-white text-2xl">🥉</span>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 min-w-[120px]">
                <h3 className="font-bold text-white text-sm">{users[2].username}</h3>
                <p className="text-orange-400 text-xs">{users[2].points} pts</p>
                <p className="text-orange-400 text-xs">Level {users[2].level}</p>
              </div>
              <div className="w-full h-12 bg-gradient-to-t from-orange-600 to-red-600 mt-2 rounded-t-lg"></div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
            <h2 className="text-xl font-semibold text-white">All Rankings</h2>
          </div>
          
          <div className="divide-y divide-slate-700">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-6 hover:bg-slate-700/50 transition-colors ${
                  index < 3 ? 'bg-slate-700/30' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getRankColor(index)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold">
                      {index < 3 ? getRankIcon(index) : index + 1}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {user.username}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Joined the cybersecurity community
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-green-400 font-bold text-lg">{user.points}</p>
                      <p className="text-slate-400 text-xs">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 font-bold text-lg">{user.level}</p>
                      <p className="text-slate-400 text-xs">Level</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No rankings yet</h3>
              <p className="text-slate-500 text-sm">Be the first to earn points and climb the leaderboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}