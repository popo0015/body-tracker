<script lang="ts">
  import { onMount } from "svelte";
  import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
    BarController,
    BarElement,
  } from "chart.js";

  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
    BarController,
    BarElement,
  );

  export let data: {
    measurements: {
      date: string;
      waist: number;
      hips: number;
      thigh: number;
      arm: number;
      chest: number;
      underNavel: number;
      weight: number;
    }[];
    meals: {
      date: string;
      items: {
        nutrition: { calories: number } | null;
      }[];
    }[];
    workouts: {
      date: string;
      exercises: {
        exercise: any;
        name: string;
        sets: { reps: number; weight: number }[];
      }[];
    }[];
  };

  import { workoutPresets } from "$lib/presets.ts";

  let measurements = data.measurements || [];
  let meals = data.meals || [];
  let workouts = data.workouts || [];

  // Sum total calories grouped by date
  let caloriesByDay: { date: string; calories: number }[] = [];

  const caloriesMap = new Map<string, number>();

  for (const day of meals) {
    const date = day.date.split("T")[0]; // normalize date string (yyyy-mm-dd)
    let totalCalories = 0;
    for (const meal of day.items) {
      if (meal.nutrition?.calories) totalCalories += meal.nutrition.calories;
    }
    caloriesMap.set(date, (caloriesMap.get(date) ?? 0) + totalCalories);
  }

  caloriesByDay = Array.from(caloriesMap.entries())
    .map(([date, calories]) => ({ date, calories }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Build a map of workouts by date to workout day (T1-T4)
  // Here we try to detect the T1-T4 tag from the first exercise name as example
  let workoutDayMap = new Map<string, string>();

  workouts.forEach((workout) => {
    console.log("Workout names:", workout);

    const workoutDay = inferWorkoutDay(
      workout.exercises.map((e) => ({ exercise: e.exercise })),
    );
    workoutDayMap.set(workout.date.split("T")[0], workoutDay);
  });

  // Function to find best matching workout preset for a workout's exercises
  function inferWorkoutDay(workoutExercises: { exercise?: string }[]): string {
    if (!workoutExercises.length) return "None";

    // Filter only exercises with valid names
    const workoutNames = workoutExercises
      .map((e) => e.exercise)
      .filter((name): name is string => typeof name === "string")
      .map((name) => name.toLowerCase());

    if (workoutNames.length === 0) return "Unknown";

    let bestMatch = { name: "Unknown", score: 0 };

    for (const [presetName, presetExercises] of Object.entries(
      workoutPresets,
    )) {
      const presetLower = presetExercises.map((e) => e.toLowerCase());
      const matches = workoutNames.filter((name) =>
        presetLower.includes(name),
      ).length;

      if (matches > bestMatch.score) {
        bestMatch = { name: presetName, score: matches };
      }
    }

    if (bestMatch.name.includes("ДЕН 1")) return "T1";
    if (bestMatch.name.includes("ДЕН 2")) return "T2";
    if (bestMatch.name.includes("ДЕН 3")) return "T3";
    if (bestMatch.name.includes("ДЕН 4")) return "T4";

    return "Unknown";
  }

  let weightChartCanvas: HTMLCanvasElement;
  let caloriesChartCanvas: HTMLCanvasElement;

  let weightChart: Chart;
  let caloriesChart: Chart;

  // Small measurement chart canvases
  let waistChartCanvas: HTMLCanvasElement;
  let hipsChartCanvas: HTMLCanvasElement;
  let thighChartCanvas: HTMLCanvasElement;
  let armChartCanvas: HTMLCanvasElement;
  let chestChartCanvas: HTMLCanvasElement;
  let underNavelChartCanvas: HTMLCanvasElement;

  onMount(() => {
    buildWeightChart();
    buildCaloriesChart();
    buildMeasurementCharts();
  });

  function buildWeightChart() {
    weightChart?.destroy();
    weightChart = new Chart(weightChartCanvas, {
      type: "line",
      data: {
        labels: measurements.map((m) => m.date),
        datasets: [
          {
            label: "Weight (kg)",
            data: measurements.map((m) => m.weight),
            borderColor: "#3b82f6",
            backgroundColor: "#93c5fd44",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } },
      },
    });
  }

  function buildCaloriesChart() {
    caloriesChart?.destroy();
    caloriesChart = new Chart(caloriesChartCanvas, {
      type: "line",
      data: {
        labels: caloriesByDay.map((c) => c.date),
        datasets: [
          {
            label: "Calories",
            data: caloriesByDay.map((c) => c.calories),
            borderColor: "#10b981",
            backgroundColor: "#6ee7b744",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  function buildSmallChart(
    canvas: HTMLCanvasElement,
    label: string,
    data: number[],
  ) {
    return new Chart(canvas, {
      type: "line",
      data: {
        labels: measurements.map((m) => m.date),
        datasets: [
          {
            label,
            data,
            borderColor: "#f97316",
            backgroundColor: "#fdba74",
            fill: false,
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
        elements: { point: { radius: 0 } },
      },
    });
  }

  function buildMeasurementCharts() {
    buildSmallChart(
      waistChartCanvas,
      "Waist (талия)",
      measurements.map((m) => m.waist),
    );
    buildSmallChart(
      hipsChartCanvas,
      "Hips (ханш)",
      measurements.map((m) => m.hips),
    );
    buildSmallChart(
      thighChartCanvas,
      "Thigh (бедро)",
      measurements.map((m) => m.thigh),
    );
    buildSmallChart(
      armChartCanvas,
      "Arm (ръка)",
      measurements.map((m) => m.arm),
    );
    buildSmallChart(
      chestChartCanvas,
      "Chest (гръдна обиколка)",
      measurements.map((m) => m.chest),
    );
    buildSmallChart(
      underNavelChartCanvas,
      "Under Navel (през пъпа)",
      measurements.map((m) => m.underNavel),
    );
  }

  function getLast30Days(): string[] {
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }
</script>

<h1 class="text-3xl font-extrabold mb-8 text-center flex items-center gap-2">
  <span>📊</span> History & Progress
</h1>

<div class="max-w-5xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
  <section>
    <h2 class="text-xl font-semibold mb-6 border-b border-gray-300 pb-2">
      Weight Over Last 30 Days
    </h2>
    <canvas
      bind:this={weightChartCanvas}
      class="w-full max-h-96 rounded-lg shadow-md bg-white p-4"
    ></canvas>
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-6 border-b border-gray-300 pb-2">
      Calories Over Last 30 Days
    </h2>
    <canvas
      bind:this={caloriesChartCanvas}
      class="w-full max-h-96 rounded-lg shadow-md bg-white p-4"
    ></canvas>
  </section>

  <section>
    <h2 class="text-lg font-semibold mb-4">Body Measurements</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Waist (талия)</h3>
        <canvas bind:this={waistChartCanvas} class="w-full h-36"></canvas>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Hips (ханш)</h3>
        <canvas bind:this={hipsChartCanvas} class="w-full h-36"></canvas>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Thigh (бедро)</h3>
        <canvas bind:this={thighChartCanvas} class="w-full h-36"></canvas>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Arm (ръка)</h3>
        <canvas bind:this={armChartCanvas} class="w-full h-36"></canvas>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Chest (гръдна обиколка)</h3>
        <canvas bind:this={chestChartCanvas} class="w-full h-36"></canvas>
      </div>
      <div class="bg-white p-4 rounded shadow">
        <h3 class="font-semibold mb-2">Under Navel (през пъпа)</h3>
        <canvas bind:this={underNavelChartCanvas} class="w-full h-36"></canvas>
      </div>
    </div>
  </section>

  <!-- New Workout Calendar Section -->
  <section>
    <h2 class="text-lg font-semibold mb-4">Workout Calendar</h2>
    <div
      class="grid grid-cols-7 gap-2 text-center max-w-xl mx-auto bg-blue-300 p-4 rounded shadow"
    >
      {#each getLast30Days() as day}
        <div
          class="p-2 rounded cursor-default"
          class:bg-indigo-500={workoutDayMap.get(day) === "T1"}
          class:bg-green-500={workoutDayMap.get(day) === "T2"}
          class:bg-yellow-400={workoutDayMap.get(day) === "T3"}
          class:bg-pink-400={workoutDayMap.get(day) === "T4"}
          title={`Workout on ${day}: ${workoutDayMap.get(day) ?? "None"}`}
          style="color: white; font-weight: bold;"
        >
          {day.split("-")[2]}
          {workoutDayMap.get(day) ?? ""}
        </div>
      {/each}
    </div>

    <div class="max-w-xl mx-auto mt-4 text-center">
      <div class="inline-block mr-4">
        <span class="inline-block w-5 h-5 bg-indigo-500 rounded"></span> T1
      </div>
      <div class="inline-block mr-4">
        <span class="inline-block w-5 h-5 bg-green-500 rounded"></span> T2
      </div>
      <div class="inline-block mr-4">
        <span class="inline-block w-5 h-5 bg-yellow-400 rounded"></span> T3
      </div>
      <div class="inline-block mr-4">
        <span class="inline-block w-5 h-5 bg-pink-400 rounded"></span> T4
      </div>
    </div>
  </section>
</div>

<style>
  canvas {
    max-height: 200px;
  }
</style>
