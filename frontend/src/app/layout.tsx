import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <nav className="bg-white shadow p-4 mb-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            <Link href="/quizzes" className="font-bold text-lg text-black hover:text-blue-600">
              Quiz Builder
            </Link>
            <Link href="/create" className="text-blue-500 hover:underline">
              Create Quiz
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

