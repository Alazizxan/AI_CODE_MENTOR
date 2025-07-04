"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CoursePage() {
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
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
        // 🔑 Foydalanuvchini olish
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // 📚 Kursni olish
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const found = data.find((c: any) => c._id === params.id);
        setCourse(found);
      } catch (err) {
        console.error("❌ Ma'lumot olishda xato:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (taskIndex: number, code: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/course/submit/${params.id}/${taskIndex}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );
      const data = await res.json();
      setFeedback(data.feedback);

      if (data.passed) {
        alert("✅ Vazifa muvaffaqiyatli bajarildi!");
        router.refresh(); // ✅ Foydalanuvchi progressini yangilash
      }
    } catch (err) {
      console.error("❌ Kod yuborishda xato:", err);
    }
  };

  if (!course || !user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-2">{course.description}</p>

      <div className="mt-4">
        {course.tasks.map((task: any, idx: number) => {
          const unlocked =
            user.completedTasks.some(
              (t: any) =>
                t.courseId === params.id && t.taskIndex === idx - 1
            ) || idx === 0;

          return (
            <div
              key={task._id}
              className={`mb-4 border p-4 rounded ${
                unlocked ? "bg-white" : "bg-gray-200 opacity-50"
              }`}
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              {unlocked && (
                <>
                  <textarea
                    placeholder="Kod yozing..."
                    className="w-full border rounded mt-2 p-2"
                    rows={5}
                    id={`code-${idx}`}
                  ></textarea>
                  <button
                    onClick={() =>
                      handleSubmit(
                        idx,
                        (
                          document.getElementById(`code-${idx}`) as HTMLTextAreaElement
                        ).value
                      )
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      {feedback && (
        <p className="mt-4 text-green-600 font-medium">📝 {feedback}</p>
      )}
    </div>
  );
}
