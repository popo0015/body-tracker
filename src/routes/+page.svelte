<script lang="ts">
  import { loadEntries } from '$lib/storage';

  const today = new Date().toISOString().slice(0, 10);
  const entry = loadEntries().find(e => e.date === today);
</script>

<main class="max-w-2xl mx-auto p-6 space-y-6">
  <h1 class="text-3xl font-bold text-center">🏋️‍♀️ Fit Tracker</h1>
  <p class="text-center text-gray-600">Здравей, Силвия! 📅 Днес е <strong>{today}</strong></p>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
    <a href="/measurements" class="card">
      📏 Measurements
      <p class="text-sm text-gray-500 mt-2">
        {#if entry?.measurements}
          ✅ Saved
        {:else}
          ⏳ Not added
        {/if}
      </p>
    </a>

    <a href="/meals" class="card">
      🥗 Meals
      <p class="text-sm text-gray-500 mt-2">
        {#if entry?.meals?.length}
          {entry.meals.length} item(s)
        {:else}
          ⏳ Not added
        {/if}
      </p>
    </a>

    <a href="/workouts" class="card">
      🏋️ Workouts
      <p class="text-sm text-gray-500 mt-2">
        {#if entry?.workouts?.length}
          {entry.workouts.length} set(s)
        {:else}
          ⏳ Not added
        {/if}
      </p>
    </a>
  </div>

  <p class="text-sm text-center text-gray-400 mt-6">
    All data is stored locally. You got this 💪
  </p>
</main>

<style>
  .card {
    @apply bg-white p-6 rounded-xl shadow text-center font-semibold hover:bg-gray-50 transition;
  }
</style>
