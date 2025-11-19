export default function HeroSection({ imagePath, title, description }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 text-center">
      <img
        src={imagePath}
        alt="Profile"
        className="w-48 h-48 md:w-64 md:h-64 rounded-full mx-auto mb-8 object-cover"
      />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {description}
      </p>
    </section>
  );
}
