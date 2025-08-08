Setup
1. Configure Database & Prisma (inside backend)

Create .env in backend/:

DATABASE_URL="file:./dev.db"

Run migrations and generate Prisma client:

cd backend
npm install
npx prisma migrate dev --name init

2. Start Backend

cd backend
npm run dev

Runs on http://localhost:4000

3. Start Frontend

cd frontend
npm install
npm run dev

Runs on http://localhost:3000