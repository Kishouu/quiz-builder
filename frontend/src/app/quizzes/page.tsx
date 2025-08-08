'use client';

import { useEffect, useState } from 'react';
import { getAllQuizzes } from '@/services/api';
import { Quiz, BackendQuiz } from '@/types/quiz';
import Link from 'next/link';

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const backendQuizzes: BackendQuiz[] = await getAllQuizzes();

      const mappedQuizzes: Quiz[] = backendQuizzes.map((backendQuiz) => ({
        id: backendQuiz.id,
        title: backendQuiz.title,
        questions: backendQuiz.questions.map((question) => ({
          type: question.type.toLowerCase() as 'boolean' | 'input' | 'checkbox',
          text: question.text,
          options: question.options,
          correctAnswer: question.answer,
        })),
      }));

      setQuizzes(mappedQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`http://localhost:4000/quizzes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete quiz with id ${id}`);
      }

      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete quiz. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz Dashboard</h1>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {quiz.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {quiz.questions.length} question
                  {quiz.questions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => quiz.id && handleDelete(quiz.id)}
                disabled={deletingId === quiz.id}
                className={`font-bold text-lg ${
                  deletingId === quiz.id
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-500 hover:text-red-700'
                }`}
                title="Delete quiz"
              >
                {deletingId === quiz.id ? 'Deleting...' : '✕'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
