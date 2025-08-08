import axios from 'axios';
import { Quiz, BackendQuestion } from '@/types/quiz';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface BackendQuiz {
  id: string;
  title: string;
  questions: {
    type: string;
    text: string;
    options?: string[];
    answer: string | string[] | boolean;
  }[];
}

interface CreateQuizPayload {
  title: string;
  questions: BackendQuestion[];
}

// GET all quizzes (returns backend format)
export const getAllQuizzes = async (): Promise<BackendQuiz[]> => {
  const res = await axios.get(`${API_BASE}/quizzes/`);
  return res.data;
};

// GET single quiz by ID (returns backend format)
export const getQuizById = async (id: string): Promise<BackendQuiz> => {
  const res = await axios.get(`${API_BASE}/quizzes/${id}`);
  return res.data;
};

// POST a new quiz
export const createQuiz = async (quiz: CreateQuizPayload): Promise<BackendQuiz> => {
  const res = await axios.post(`${API_BASE}/quizzes`, quiz);
  return res.data;
};

// DELETE a quiz
export const deleteQuiz = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/quizzes/${id}`);
};
