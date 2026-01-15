export default function Home() {
  return (
    <main className="bg-cream flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-barn-600 mb-4 text-4xl font-bold">
        Welcome to ChickCheck
      </h1>
      <p className="text-wood-dark mb-8 max-w-md text-center text-lg">
        Your 8-week guide to raising healthy, happy chicks.
      </p>
      <div className="flex gap-4">
        <button className="bg-barn-500 rounded-rustic shadow-rustic hover:bg-barn-600 px-6 py-3 font-medium text-white transition-colors">
          Get Started
        </button>
        <button className="bg-straw-100 text-barn-800 rounded-rustic hover:bg-straw-200 px-6 py-3 font-medium transition-colors">
          Learn More
        </button>
      </div>
    </main>
  );
}
