"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VideoPlayerPage() {
  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/course/lessons/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setLessons(data);
        setLesson(data[Number(params.lessonIndex)]);

        // 📌 Ko‘rilgan deb belgilash
        await fetch(
          `http://localhost:5000/api/course/lessons/${params.id}/${params.lessonIndex}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("❌ Videoni yuklashda xato:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, []);

  if (loading) return <p>Loading video...</p>;

  const nextIndex = Number(params.lessonIndex) + 1;
  const prevIndex = Number(params.lessonIndex) - 1;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <video src={lesson.videoUrl} controls className="w-full rounded shadow" />

      <div className="flex justify-between mt-4">
        {prevIndex >= 0 && (
          <button
            onClick={() =>
              router.push(`/course/${params.id}/lessons/${prevIndex}`)
            }
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            ⬅️ Previous
          </button>
        )}
        {nextIndex < lessons.length && (
          <button
            onClick={() =>
              router.push(`/course/${params.id}/lessons/${nextIndex}`)
            }
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Next ➡️
          </button>
        )}
      </div>
    </div>
  );
}
