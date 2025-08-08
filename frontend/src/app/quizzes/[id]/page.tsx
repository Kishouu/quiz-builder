'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  type: string;
  text: string;
  options: string[] | null;
  answer: string | null;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface BackendQuestion {
  id: number;
  type: string;
  text: string;
  options: string[] | null | string;
  answer: string | null;
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/quizzes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Quiz ${id} not found`);
        return res.json();
      })
      .then((data) => {
        const parsedQuestions = data.questions.map((q: BackendQuestion) => ({
          ...q,
          options:
            typeof q.options === 'string'
              ? JSON.parse(q.options)
              : q.options || [],
        }));

        setQuiz({ ...data, questions: parsedQuestions });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">No quiz found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>

      <div className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <p className="text-lg font-semibold mb-3 text-black">
              Question {idx + 1}: {q.text}
            </p>

            {q.options && q.options.length > 0 && (
              <ul className="list-disc list-inside space-y-1 mb-4">
                {q.options.map((opt, i) => (
                  <li key={i} className="text-gray-700">
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded w-fit">
              Correct answer: <span className="font-medium">{q.answer}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
