import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

//POST /quizzes
router.post('/', async (req, res) => {
    const { title, questions } = req.body;

    const quiz = await prisma.quiz.create({
	data: {
	    title,
	    questions: {
		create: questions.map((q: any) => ({
		    type: q.type,
		    text: q.text,
		    options: q.options ? JSON.stringify(q.options) : null,
		    answer: JSON.stringify(q.answer),
		    })),
		},
	    },
	});

	res.json(quiz);
});

//GET /quizzes
router.get('/', async (_, res) => {
    const quizzes = await prisma.quiz.findMany({
	include: { questions: true },
    });

    const result = quizzes.map((q) => ({
	id: q.id,
	title: q.title,
	questionCount: q.questions.length,
    }));

    res.json(result);
});

//GET /quizzes/:id
router.get('/:id', async (req, res) => {
    const quiz = await prisma.quiz.findUnique({
	where: { id: Number(req.params.id) },
	include: { questions: true },
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    res.json({
	...quiz,
	questions: quiz.questions.map((q) => ({
	    ...q,
	    options: q.options ? JSON.parse(q.options) : null,
	    answer: JSON.parse(q.answer),
	})),
    });
});

//DELETE /quizzes/:id
router.delete('/:id', async (req, res) => {
    await prisma.question.deleteMany({
	where: { quizId: Number(req.params.id) },
    });
    await prisma.quiz.delete({
	where: { id: Number(req.params.id) },
    });
    res.json({ succes: true });
});

export default router;
