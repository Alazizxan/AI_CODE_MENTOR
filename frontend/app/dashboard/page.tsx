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

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (!user) return <p className="p-4 text-red-600">Foydalanuvchi topilmadi</p>;

  // 🏆 Level aniqlash
  const levelTitle =
    user.level < 5 ? "👶 Beginner" : user.level < 10 ? "💻 Intermediate" : "🚀 Expert";

  // 📊 Kurs progress barlar uchun data
  const barData = {
    labels: user.courses.map((c: any) => c.title),
    datasets: [
      {
        label: "Progress (%)",
        data: user.courses.map(
          (c: any) => (c.completedTasks.length / c.totalTasks) * 100
        ),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 🍩 Ballar distribution uchun data
  const doughnutData = {
    labels: ["Completed Points", "Remaining Points"],
    datasets: [
      {
        data: [user.points, 1000 - user.points],
        backgroundColor: ["#36A2EB", "#E5E5E5"],
        hoverBackgroundColor: ["#36A2EB", "#CCCCCC"],
      },
    ],
  };

  // 📈 Kunlik ball progress (mock data)
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Points",
        data: [5, 10, 15, 20, 30, 40, user.points],
        borderColor: "#4ADE80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">👋 Welcome, {user.username}</h1>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 bg-blue-50 p-4 rounded shadow">
          <p className="text-lg">
            🏆 Level: <b>{user.level}</b> ({levelTitle})
          </p>
          <p className="text-lg">⭐ Points: <b>{user.points}</b></p>
        </div>
        <div className="flex-1 bg-green-50 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🎯 Progress Overview</h2>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* 📚 Kurs Progress bar */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📚 Kurslar Progress</h2>
        {user.courses.map((c: any) => {
          const percent =
            c.totalTasks > 0
              ? (c.completedTasks / c.totalTasks) * 100
              : 0;
          const badge =
            percent < 25
              ? "🔥 Beginner"
              : percent < 75
              ? "💻 Intermediate"
              : "🚀 Expert";

          return (
            <div
              key={c._id}
              className="mb-4 bg-gray-50 p-3 rounded hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">
                  {c.title}{" "}
                  <span className="text-sm text-gray-600">
                    ({percent.toFixed(1)}%)
                  </span>
                </p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {badge}
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded h-4">
              <div
                className="bg-green-500 h-4 rounded"
                style={{
                  width: `${
                    c.totalTasks > 0
                        ? (c.completedTasks.length / c.totalTasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
              {c.totalTasks > 0
              ? `${((c.completedTasks.length / c.totalTasks) * 100).toFixed(1)}%`
                : "0%"}
              </p>

              <div className="w-full bg-gray-300 rounded h-4">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <button
                onClick={() => router.push(`/course/${c._id}`)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                ▶ Continue Course
              </button>
            </div>
          );
        })}
      </div>

      {/* 📈 Line Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📈 Daily Progress</h2>
        <Line data={lineData} />
      </div>

      {/* 🏅 Top Users */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">🏅 Top Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user.topUsers.map((u: any, i: number) => (
            <div
              key={i}
              className="bg-gray-50 p-3 rounded shadow hover:bg-gray-100"
            >
              <p className="font-semibold">
                {i + 1}. {u.username}
              </p>
              <p className="text-sm text-gray-600">⭐ {u.points} points</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
