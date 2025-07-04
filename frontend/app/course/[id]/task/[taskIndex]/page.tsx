"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskPage() {
  const [course, setCourse] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const foundCourse = data.find((c: any) => c._id === params.id);

        if (!foundCourse) return router.push("/dashboard");

        setCourse(foundCourse);
        setTask(foundCourse.tasks[Number(params.taskIndex)]);
      } catch (error) {
        console.error("Kursni yuklashda xatolik:", error);
      }
    };

    fetchTask();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/course/submit/${params.id}/${params.taskIndex}`,
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
      setSubmitted(true);
    } catch (error) {
      console.error("Kod yuborishda xatolik:", error);
      setFeedback("❌ Kodni yuborishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return <p>Loading task...</p>;

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
      <p className="mb-4 text-gray-600">{task.description}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Kod yozing..."
        className="w-full border rounded p-2 mb-4"
        rows={8}
        disabled={submitted}
      ></textarea>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Tekshirilmoqda..." : "Submit"}
        </button>
      )}

      {feedback && (
        <div
          className={`mt-4 p-4 rounded ${
            feedback.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <h2 className="font-semibold">AI Feedback:</h2>
          <p>{feedback}</p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
              🔙 Back to Tasks
            </button>
            {hasNextTask && (
              <button
                onClick={() =>
                  router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                }
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                🟢 Next Task
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
