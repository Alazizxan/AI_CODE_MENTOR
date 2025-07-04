"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("http://localhost:5000/api/user/leaderboard");
      const data = await res.json();
      setUsers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>
      <div className="bg-white rounded shadow p-4">
        {users.map((u, idx) => (
          <div
            key={u._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="font-semibold">
              #{idx + 1} {u.username}
            </span>
            <span>Points: {u.points}</span>
            <span>Level: {u.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
