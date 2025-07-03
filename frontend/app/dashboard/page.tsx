"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/course/list", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(res.data.courses);
      } catch (err) {
        alert("Xatolik: Kurslar olinmadi");
        router.push("/login");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.level}
            className="bg-white p-4 rounded shadow hover:scale-105 transition"
            onClick={() => router.push(`/course/${course.level}`)}
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
