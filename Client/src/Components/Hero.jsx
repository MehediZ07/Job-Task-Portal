export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-100 to-violet-300 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-900">
        MANAGE TASKS EFFORTLESSLY,
      </h1>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mt-2">
        STAY AHEAD ALWAYS
      </h2>
      <p className="text-center text-gray-700 mt-4 max-w-xl">
        Boost your productivity with TaskHive, the smart task manager that helps
        you prioritize, track, and complete your tasks efficiently. Stay
        organized, stay focused, and achieve your goals effortlessly.
      </p>
      <button className="mt-6 px-6 py-3 bg-violet-600 text-white font-medium text-lg rounded-full shadow-md hover:bg-violet-500 transition-all">
        Get Started
      </button>
    </div>
  );
}
