export default function HeroSection({ imagePath, title, description }) {
  return (
    <section className="mt-6 bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border-gray-300 dark:border-gray-700 max-w-4xl mx-auto px-8 py-15 flex flex-col md:flex-row items-center gap-16">
      <div className="w-1/2">
        <img
          src={imagePath}
          alt="Profile"
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>
      <div className="w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          {description}
        </p>
      </div>
    </section>
  );
}
