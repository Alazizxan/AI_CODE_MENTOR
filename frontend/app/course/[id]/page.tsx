"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CoursePage() {
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // ✅ Foydalanuvchi ma'lumotini olish
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // ✅ Kurs ma'lumotini olish
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const found = data.find((c: any) => c._id === params.id);
        setCourse(found);
      } catch (err) {
        console.error("Kurslarni olishda xatolik:", err);
      }
    };

    fetchData();
  }, []);

  if (!course || !user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="mb-4 text-gray-600">{course.description}</p>

      <div className="grid gap-4">
        {course.tasks.map((task: any, idx: number) => {
          // ✅ Faqat 1-vazifa va avvalgi bajarilgan vazifalarni ochib ber
          const unlocked =
            user.completedTasks.some(
              (t: any) => t.courseId === params.id && t.taskIndex === idx - 1
            ) || idx === 0;

          return (
            <div
              key={task._id}
              className={`p-4 rounded shadow transition ${
                unlocked
                  ? "bg-green-100 cursor-pointer hover:bg-green-200"
                  : "bg-gray-300 opacity-50"
              }`}
              onClick={() =>
                unlocked && router.push(`/course/${params.id}/task/${idx}`)
              }
            >
              <h2 className="text-xl font-semibold">
                {idx + 1}. {task.title}
              </h2>
              <p className="text-gray-700">{task.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
