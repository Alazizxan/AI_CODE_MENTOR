"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [watchedLessons, setWatchedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/course/lessons/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) {
          alert("❌ Bu kurs premium. Obuna bo‘ling.");
          router.push("/dashboard");
          return;
        }

        const data = await res.json();
        setLessons(data);

        // Foydalanuvchining ko‘rilgan videolari
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        const watched = userData.watchedLessons
          .filter((l: any) => l.courseId === params.id)
          .map((l: any) => l.lessonIndex);
        setWatchedLessons(watched);
      } catch (err) {
        console.error("❌ Darslarni yuklashda xato:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">📖 Kurs darslari</h1>
      <ul className="space-y-2">
        {lessons.map((lesson, idx) => {
          const unlocked = idx === 0 || watchedLessons.includes(idx - 1);
          const watched = watchedLessons.includes(idx);

          return (
            <li
              key={idx}
              className={`p-4 rounded shadow ${
                unlocked ? "bg-green-100 cursor-pointer hover:bg-green-200" : "bg-gray-200 opacity-50"
              }`}
              onClick={() =>
                unlocked && router.push(`/course/${params.id}/lessons/${idx}`)
              }
            >
              <h2 className="text-xl font-semibold">
                {idx + 1}. {lesson.title} {watched ? "✅" : unlocked ? "🔓" : "🔒"}
              </h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
