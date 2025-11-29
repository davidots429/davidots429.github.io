export default function Footer() {
  return (
    <footer className="bg-gray-100 shadow-sm dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Davidots429 Blog. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://github.com/davidots429"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
