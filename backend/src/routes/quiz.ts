import express from 'express';
import { PrismaClient, Prisma, QuestionType } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  answer: string | null;
  options: string | null;
  quizId: number;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

// POST /quizzes
router.post('/', async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    for (const q of questions) {
      if (q.answer === undefined) {
        return res.status(400).json({ error: `Missing answer in question: ${q.text}` });
      }
    }

    const createdQuiz = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const quiz = await tx.quiz.create({
        data: { title },
      });

      await tx.question.createMany({
        data: questions.map((q: any) => ({
          quizId: quiz.id,
          type: q.type as QuestionType, // ensure correct enum type
          text: q.text,
          options: q.options ? JSON.stringify(q.options) : null,
          answer: JSON.stringify(q.answer),
        })),
      });

      return quiz;
    });

    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error('Error in POST /quizzes:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// GET /quizzes
router.get('/', async (_, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
    });

    const result: Quiz[] = quizzes.map((quiz: Quiz) => ({
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map((q: Question) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options ? JSON.parse(q.options) : null,
        answer: q.answer ? JSON.parse(q.answer) : null,
        quizId: q.quizId,
      })),
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET /quizzes/:id
router.get('/:id', async (req, res) => {
  try {
    const quizId = Number(req.params.id);
    if (isNaN(quizId)) {
      return res.status(400).json({ error: 'Invalid quiz ID' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// DELETE /quizzes/:id
router.delete('/:id', async (req, res) => {
  try {
    const quizId = Number(req.params.id);
    if (isNaN(quizId)) {
      return res.status(400).json({ error: 'Invalid quiz ID' });
    }

    await prisma.quiz.delete({
      where: { id: quizId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

export default router;
