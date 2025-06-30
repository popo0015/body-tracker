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
        name: string;
        sets: { reps: number; weight: number }[];
      }[];
    }[];
  };

  let measurements = data.measurements || [];
  let meals = data.meals || [];
  let workouts = data.workouts || [];

  // Calculate total calories per day from meals
  let caloriesByDay = meals.map((day) => {
    let totalCalories = 0;
    for (const meal of day.items) {
      if (meal.nutrition?.calories) totalCalories += meal.nutrition.calories;
    }
    return { date: day.date, calories: totalCalories };
  });

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
</script>

<h1 class="text-3xl font-extrabold mb-8 text-center flex items-center gap-2">
  <span>📊</span> History & Progress
</h1>

<div class="max-w-5xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
  <section>
    <h2 class="text-xl font-semibold mb-6 border-b border-gray-300 pb-2">Weight Over Last 30 Days</h2>
    <canvas
      bind:this={weightChartCanvas}
      class="w-full max-h-96 rounded-lg shadow-md bg-white p-4"
    ></canvas>
  </section>

  <section>
    <h2 class="text-xl font-semibold mb-6 border-b border-gray-300 pb-2">Calories Over Last 30 Days</h2>
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
</div>

<style>
  canvas {
    max-height: 200px;
  }
</style>
