<script lang="ts">
  import { onMount } from "svelte";
  import { workoutPresets } from "$lib/presets.js";

  const today = new Date().toISOString().slice(0, 10);

  interface Set {
    reps: number;
    weight: number;
  }

  interface WorkoutEntry {
    exercise: string;
    sets: Set[];
    custom?: boolean;
  }

  let workouts: WorkoutEntry[] = [];
  let selectedPreset = "";
  let customExercise = "";
  let entries: WorkoutEntry[] = [];

  onMount(() => {
    const saved = localStorage.getItem("workouts-" + today);
    if (saved) {
      workouts = JSON.parse(saved);
    }
  });

  function selectPreset() {
    workouts = workoutPresets[
      selectedPreset as keyof typeof workoutPresets
    ].map((name) => ({
      exercise: name,
      sets: [{ reps: 0, weight: 0 }],
    }));
  }

  function addSetToWorkout(index: number) {
    workouts[index].sets.push({ reps: 0, weight: 0 });
  }

  function addCustomExercise() {
    if (customExercise.trim() === "") return;
    workouts.push({
      exercise: customExercise,
      sets: [{ reps: 0, weight: 0 }],
      custom: true,
    });
    customExercise = "";
  }

  async function saveWorkouts() {
    const response = await fetch("/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: today,
        exercises: workouts, // workouts array as is
      }),
    });

    if (!response.ok) {
      alert("Failed to save workouts");
    } else {
      alert("Workouts saved successfully!");
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">🏋️‍♀️ Workout Tracker</h1>

<label class="block mb-4">
  <span class="font-medium">📅 Choose a workout day</span>
  <select
    bind:value={selectedPreset}
    on:change={selectPreset}
    class="input mt-1"
  >
    <option value="" disabled selected>-- Select a workout --</option>
    {#each Object.keys(workoutPresets) as key}
      <option value={key}>{key}</option>
    {/each}
  </select>
</label>

<div class="mb-6">
  <h2 class="font-semibold">➕ Add Custom Exercise</h2>
  <input
    bind:value={customExercise}
    placeholder="e.g. Планк"
    class="input mt-1"
  />
  <button on:click={addCustomExercise} class="btn mt-2">Add</button>
</div>

{#each workouts as w, i}
  <div class="bg-white p-4 mb-4 rounded shadow">
    <h3 class="font-semibold mb-2">{w.exercise}</h3>
    {#each w.sets as s, j}
      <div class="grid grid-cols-2 gap-4 mb-2">
        <input
          type="number"
          bind:value={s.reps}
          class="input"
          placeholder="Reps"
        />
        <input
          type="number"
          bind:value={s.weight}
          class="input"
          placeholder="Weight (kg)"
        />
      </div>
    {/each}
    <button
      on:click={() => addSetToWorkout(i)}
      class="btn bg-gray-300 text-black">➕ Add Set</button
    >
  </div>
{/each}

<button on:click={saveWorkouts} class="btn bg-blue-600 hover:bg-blue-700 mt-6"
  >💾 Save Workouts</button
>

<style>
  .input {
    @apply w-full p-2 border rounded;
  }

  .btn {
    @apply mt-2 px-4 py-2 rounded font-semibold shadow;
  }
</style>
