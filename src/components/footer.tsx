'use client';

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-gray-300 dark:text-gray-400 bg-gray-800 dark:bg-gray-900">
      © {new Date().getFullYear()} My Interactive Portfolio. Click around, you might find some easter eggs!
    </footer>
  );
}