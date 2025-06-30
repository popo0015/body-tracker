<script lang="ts">
  import { onMount } from 'svelte';
  import { loadEntries, upsertEntry, type DailyEntry } from '$lib/storage';

  const today = new Date().toISOString().slice(0, 10);

  let meals: any[] = [];
  let product = '';
  let grams = '';
  let kcal = '';

  onMount(() => {
    const entry = loadEntries().find(e => e.date === today);
    if (entry?.meals) meals = [...entry.meals];
  });

  function addMeal() {
    const newMeal = {
      product,
      grams: +grams,
      kcal: +kcal
    };
    meals = [...meals, newMeal];

    const entry: DailyEntry = { date: today, meals };
    upsertEntry(entry);

    product = '';
    grams = '';
    kcal = '';
  }
</script>

<h1 class="text-2xl font-bold mb-4">🍽️ Meals</h1>

<form class="grid sm:grid-cols-3 gap-4 mb-4">
  <input class="input" placeholder="Product" bind:value={product} />
  <input class="input" type="number" placeholder="Grams" bind:value={grams} />
  <input class="input" type="number" placeholder="kcal" bind:value={kcal} />
</form>

<button on:click={addMeal} class="btn mb-4">➕ Add Meal</button>

<ul class="space-y-2">
  {#each meals as meal}
    <li class="bg-white p-3 rounded shadow text-sm">
      {meal.product} — {meal.grams}g → {meal.kcal} kcal
    </li>
  {/each}
</ul>

<style>
  .input {
    @apply p-2 border rounded w-full;
  }
  .btn {
    @apply bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow;
  }
</style>
