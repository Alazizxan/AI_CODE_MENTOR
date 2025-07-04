"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const coursesRes = await fetch("http://localhost:5000/api/course/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const coursesData = await coursesRes.json();
      setCourses(coursesData);
    };
    fetchData();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">👋 Welcome, {user.username}</h1>
      <p className="mt-2">Level: {user.level} | Points: {user.points}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="p-4 border rounded cursor-pointer bg-green-200 hover:bg-green-300"
            onClick={() => router.push(`/course/${course._id}`)}
          >
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
