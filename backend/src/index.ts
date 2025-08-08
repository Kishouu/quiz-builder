import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/quiezzes', quizRoutes);

app.get('/', (_, res) => res.send('Quiz builder API running'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
