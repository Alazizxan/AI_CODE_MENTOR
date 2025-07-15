"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CoursePage() {
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        // Foydalanuvchi ma'lumotini olish
        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // Kurs ma'lumotini olish
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const found = data.find((c: any) => c._id === params.id);
        setCourse(found);
      } catch (err) {
        console.error("Kurslarni olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Course Not Found</h2>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📖</span>
              </div>
              <h1 className="text-xl font-bold text-white">{course.title}</h1>
            </div>
            
            <button
              onClick={() => router.push("/")}
              className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 mb-8 border border-slate-600">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">📖</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-slate-300 text-lg mb-4">{course.description}</p>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Level {course.level}
                </span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  {course.tasks.length} Tasks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Course Tasks</h2>
          
          {course.tasks.map((task: any, idx: number) => {
            // Faqat 1-vazifa va avvalgi bajarilgan vazifalarni ochib ber
            const unlocked =
              user.completedTasks.some(
                (t: any) => t.courseId === params.id && t.taskIndex === idx - 1
              ) || idx === 0;

            const completed = user.completedTasks.some(
              (t: any) => t.courseId === params.id && t.taskIndex === idx
            );

            return (
              <div
                key={task._id}
                className={`bg-slate-800 rounded-lg p-6 border transition-all duration-300 ${
                  unlocked
                    ? completed
                      ? "border-green-500/50 bg-green-500/5 cursor-pointer hover:border-green-500/70 hover:bg-green-500/10"
                      : "border-slate-700 cursor-pointer hover:border-blue-500/50 hover:bg-slate-700/50"
                    : "border-slate-700/50 bg-slate-800/50 opacity-50 cursor-not-allowed"
                }`}
                onClick={() =>
                  unlocked && router.push(`/course/${params.id}/task/${idx}`)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      completed
                        ? "bg-green-500/20 text-green-400"
                        : unlocked
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-700 text-slate-500"
                    }`}>
                      <span className="text-xl">
                        {completed ? "✅" : unlocked ? "📝" : "🔒"}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        unlocked ? "text-white" : "text-slate-500"
                      }`}>
                        {idx + 1}. {task.title}
                      </h3>
                      <p className={`text-sm ${
                        unlocked ? "text-slate-300" : "text-slate-600"
                      }`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {completed && (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    )}
                    {unlocked && !completed && (
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        Available
                      </span>
                    )}
                    {!unlocked && (
                      <span className="bg-slate-700 text-slate-500 px-3 py-1 rounded-full text-sm font-medium">
                        Locked
                      </span>
                    )}
                    
                    {unlocked && (
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="bg-slate-800 rounded-xl p-6 mt-8 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Completed Tasks</span>
            <span className="text-white font-medium">
              {user.completedTasks.filter((t: any) => t.courseId === params.id).length} / {course.tasks.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (user.completedTasks.filter((t: any) => t.courseId === params.id).length / course.tasks.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}