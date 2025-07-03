"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/course/submit/${params.id}`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback(res.data.feedback);
    } catch (err: any) {
      alert('Xatolik: ' + err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-red-300 p-8">
      <h1 className="text-2xl font-bold mb-4">Bosqich: {params.id}</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Kod yozing..."
        className="w-full h-40 p-2 border rounded mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Tekshirish
      </button>
      {feedback && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="font-semibold">AI Feedback:</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
