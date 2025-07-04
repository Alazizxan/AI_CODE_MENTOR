"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Foydalanuvchi ma’lumotlarini olishda xatolik:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-20">⏳ Ma’lumotlar yuklanmoqda...</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-pink-500 to-red-600 text-white">
      <h1 className="text-3xl font-bold mb-4">👤 Account</h1>
      <p>📧 Email: {user.email}</p>
      <p>🏆 Ballar: {user.points}</p>
      <p>📈 Level: {user.level}</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-6 px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
      >
        🚪 Logout
      </button>
    </div>
  );
}
