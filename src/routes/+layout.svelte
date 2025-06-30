<script>
  import '../app.css'; // make sure this is correct path to your Tailwind file
</script>

<nav class="bg-white shadow px-6 py-4 sticky top-0 z-10">
  <div class="max-w-3xl mx-auto flex justify-between items-center">
    <a href="/" class="text-xl font-bold text-blue-600 hover:text-blue-800 transition">🏠 Fit Tracker</a>
    <div class="space-x-4 text-sm font-medium">
      <a href="/measurements" class="hover:underline">📏 Measurements</a>
      <a href="/meals" class="hover:underline">🥗 Meals</a>
      <a href="/workouts" class="hover:underline">🏋️‍♀️ Workouts</a>
      <a href="/history" class="hover:underline">📖 History</a>
    </div>
  </div>
</nav>

<main class="bg-gray-100 min-h-screen text-gray-800 p-20">
  <slot />
</main>
