"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/course/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Kurs topilmadi yoki xatolik yuz berdi.");
        }

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("❌ Kursni yuklashda xatolik:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) return <p className="p-4">⏳ Loading course details...</p>;
  if (!course) return <p className="p-4 text-red-600">❌ Kurs topilmadi</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📖 {course.title}</h1>
      <p className="text-gray-700">{course.description}</p>

      {/* 2 ta katta tugma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Tasks Card */}
        <div
          onClick={() => router.push(`/course/${course._id}/`)}
          className="cursor-pointer bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition"
        >
          <h2 className="text-2xl font-bold">📝 Tasks</h2>
          <p className="mt-2">Kursdagi barcha vazifalarni bajarish uchun bosing.</p>
        </div>

        {/* Lessons Card */}
        <div
          onClick={() => router.push(`/course/${course._id}/lessons`)}
          className="cursor-pointer bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition"
        >
          <h2 className="text-2xl font-bold">🎥 Video Lessons</h2>
          <p className="mt-2">Kursdagi barcha video darslarni ko‘rish uchun bosing.</p>
        </div>
      </div>
    </div>
  );
}
