export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-cream">
      <h1 className="text-4xl font-bold text-barn-600 mb-4">
        Welcome to ChickCheck
      </h1>
      <p className="text-lg text-wood-dark text-center max-w-md mb-8">
        Your 8-week guide to raising healthy, happy chicks.
      </p>
      <div className="flex gap-4">
        <button className="bg-barn-500 text-white px-6 py-3 rounded-rustic shadow-rustic hover:bg-barn-600 transition-colors font-medium">
          Get Started
        </button>
        <button className="bg-straw-100 text-barn-800 px-6 py-3 rounded-rustic hover:bg-straw-200 transition-colors font-medium">
          Learn More
        </button>
      </div>
    </main>
  );
}
