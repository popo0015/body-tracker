<script lang="ts">
  import { onMount } from 'svelte';
  import { loadEntries, upsertEntry, type DailyEntry } from '$lib/storage';

  const today = new Date().toISOString().slice(0, 10);

  let workouts: any[] = [];
  let exercise = '';
  let currentSets = [{ reps: '', weight: '' }];

  onMount(() => {
    const entry = loadEntries().find(e => e.date === today);
    if (entry?.workouts) workouts = [...entry.workouts];
  });

  function addSet() {
    currentSets = [...currentSets, { reps: '', weight: '' }];
  }

  function addWorkout() {
    const sets = currentSets.map(set => ({
      reps: +set.reps,
      weight: +set.weight
    }));

    const newWorkout = {
      exercise,
      sets
    };

    workouts = [...workouts, newWorkout];

    const entry: DailyEntry = { date: today, workouts };
    upsertEntry(entry);

    // Reset form
    exercise = '';
    currentSets = [{ reps: '', weight: '' }];
  }
</script>

<h1 class="text-2xl font-bold mb-4">🏋️ Workouts</h1>

<input class="input mb-2" placeholder="Exercise name" bind:value={exercise} />

<h2 class="text-lg font-semibold mt-4 mb-2">Sets:</h2>
<div class="space-y-2">
  {#each currentSets as set, i}
    <div class="grid grid-cols-2 gap-4">
      <input type="number" class="input" placeholder="Reps" bind:value={set.reps} />
      <input type="number" class="input" placeholder="Weight (kg)" bind:value={set.weight} />
    </div>
  {/each}
</div>

<button on:click={addSet} class="btn mt-2 bg-gray-400 hover:bg-gray-500">➕ Add Set</button>
<button on:click={addWorkout} class="btn mt-4">💪 Add Workout</button>

<hr class="my-6" />

<h2 class="text-xl font-semibold mb-2">📋 Today's Workouts</h2>
<ul class="space-y-4">
  {#each workouts as w}
    <li class="bg-white p-4 rounded shadow">
      <strong>{w.exercise}</strong>
      <ul class="mt-2 text-sm">
        {#each w.sets as s, idx}
          <li>Set {idx + 1}: {s.reps} reps @ {s.weight}kg</li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<style>
  .input {
    @apply p-2 border rounded w-full;
  }
  .btn {
    @apply bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded shadow mr-2;
  }
</style>
