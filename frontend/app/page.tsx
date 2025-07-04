"use client";

import { useEffect, useState } from "react";
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
      <h1 className="text-3xl font-bold">👋 Welcome, {user.username}</h1>
      <p className="mt-1">🏆 Ball: {user.points} | 🪜 Level: {user.level}</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">📚 Kurslar:</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white text-black p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/course/${course._id}`)}
          >
            <h3 className="text-xl font-bold">📖 {course.title}</h3>
            <p className="mt-2">{course.description}</p>
            <p className="mt-1">Level: {course.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
