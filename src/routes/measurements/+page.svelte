<script lang="ts">
  import { onMount } from 'svelte';
  import { loadEntries, upsertEntry, type DailyEntry } from '$lib/storage';

  const today = new Date().toISOString().slice(0, 10);

  let measurements = {
    waist: '',
    hips: '',
    thigh: '',
    arm: '',
    chest: '',
    underNavel: '',
    weight: ''
  };

  onMount(() => {
    const entry = loadEntries().find(e => e.date === today);
    if (entry?.measurements) {
      measurements = {
        waist: entry.measurements.waist?.toString() ?? '',
        hips: entry.measurements.hips?.toString() ?? '',
        thigh: entry.measurements.thigh?.toString() ?? '',
        arm: entry.measurements.arm?.toString() ?? '',
        chest: entry.measurements.chest?.toString() ?? '',
        underNavel: entry.measurements.underNavel?.toString() ?? '',
        weight: entry.measurements.weight?.toString() ?? ''
      };
    }
  });

  function save() {
    const entry: DailyEntry = {
      date: today,
      measurements: {
        ...measurements,
        waist: +measurements.waist,
        hips: +measurements.hips,
        thigh: +measurements.thigh,
        arm: +measurements.arm,
        chest: +measurements.chest,
        underNavel: +measurements.underNavel,
        weight: +measurements.weight
      }
    };
    upsertEntry(entry);
    alert('📏 Measurements saved!');
  }
</script>

<h1 class="text-2xl font-bold mb-4">📏 Body Measurements</h1>

<form class="grid grid-cols-2 gap-4 mb-6">
  <label>Талия <input class="input" bind:value={measurements.waist} type="number" /></label>
  <label>Ханш <input class="input" bind:value={measurements.hips} type="number" /></label>
  <label>Бедро <input class="input" bind:value={measurements.thigh} type="number" /></label>
  <label>Ръка <input class="input" bind:value={measurements.arm} type="number" /></label>
  <label>Гръдна обиколка <input class="input" bind:value={measurements.chest} type="number" /></label>
  <label>През пъпа <input class="input" bind:value={measurements.underNavel} type="number" /></label>
  <label>Тегло <input class="input" bind:value={measurements.weight} type="number" /></label>
</form>

<button on:click={save} class="btn">💾 Save</button>

<style>
  .input {
    @apply mt-1 w-full p-2 border rounded;
  }
  .btn {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow;
  }
</style>
