<script lang="ts">
  import { onMount } from 'svelte';

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

  async function loadMeasurements() {
    const res = await fetch('/measurements');
    if (res.ok) {
      const data = await res.json();
      const todayEntry = data.find((e: any) => e.date.startsWith(today));
      if (todayEntry) {
        measurements = {
          waist: todayEntry.waist?.toString() ?? '',
          hips: todayEntry.hips?.toString() ?? '',
          thigh: todayEntry.thigh?.toString() ?? '',
          arm: todayEntry.arm?.toString() ?? '',
          chest: todayEntry.chest?.toString() ?? '',
          underNavel: todayEntry.underNavel?.toString() ?? '',
          weight: todayEntry.weight?.toString() ?? ''
        };
      }
    }
  }

  onMount(() => {
    loadMeasurements();
  });

  async function save() {
    try {
      const payload = {
        date: today,
        waist: +measurements.waist,
        hips: +measurements.hips,
        thigh: +measurements.thigh,
        arm: +measurements.arm,
        chest: +measurements.chest,
        underNavel: +measurements.underNavel,
        weight: +measurements.weight
      };

      const res = await fetch('/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('📏 Measurements saved successfully!');
      } else {
        const err = await res.text();
        alert('❌ Failed to save measurements: ' + err);
      }
    } catch (e) {
      alert('❌ Unexpected error saving measurements');
      console.error(e);
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">📏 Body Measurements</h1>

<form class="grid grid-cols-2 gap-4 mb-6" on:submit|preventDefault={save}>
  <label>Талия
    <input class="input" type="number" min="0" bind:value={measurements.waist} />
  </label>

  <label>Ханш
    <input class="input" type="number" min="0" bind:value={measurements.hips} />
  </label>

  <label>Бедро
    <input class="input" type="number" min="0" bind:value={measurements.thigh} />
  </label>

  <label>Ръка
    <input class="input" type="number" min="0" bind:value={measurements.arm} />
  </label>

  <label>Гръдна обиколка
    <input class="input" type="number" min="0" bind:value={measurements.chest} />
  </label>

  <label>През пъпа
    <input class="input" type="number" min="0" bind:value={measurements.underNavel} />
  </label>

  <label>Тегло
    <input class="input" type="number" min="0" bind:value={measurements.weight} />
  </label>

  <button type="submit" class="btn col-span-2">💾 Save</button>
</form>

<style>
  .input {
    @apply mt-1 w-full p-2 border rounded;
  }
  .btn {
    @apply bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow;
  }
</style>
