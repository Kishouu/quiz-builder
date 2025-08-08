import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-xl w-full">
        <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-left">
          Sviatoslav Diachuk <br />
          <span className="text-blue-600 dark:text-blue-400">QuizBuilder</span>
        </h1>

        <p className="text-center sm:text-left text-lg max-w-md">
          Build, manage, and take quizzes easily with this quiz builder app powered by Next.js, React, and Prisma.
        </p>
      </main>
    </div>
  );
}
