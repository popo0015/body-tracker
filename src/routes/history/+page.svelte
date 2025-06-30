<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, BarController, BarElement } from 'chart.js';
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, BarController, BarElement);

  type MeasurementEntry = {
    date: string;
    waist: number;
    hips: number;
    thigh: number;
    arm: number;
    chest: number;
    underNavel: number;
    weight: number;
  };

  type DailyCalories = {
    date: string;
    calories: number;
  };

  let measurements: MeasurementEntry[] = [];
  let caloriesByDay: DailyCalories[] = [];

  let weightChartCanvas: HTMLCanvasElement;
  let weightChart: Chart;

  let caloriesChartCanvas: HTMLCanvasElement;
  let caloriesChart: Chart;

  // For small measurement charts, one per measurement
  let waistChartCanvas: HTMLCanvasElement;
  let hipsChartCanvas: HTMLCanvasElement;
  let thighChartCanvas: HTMLCanvasElement;
  let armChartCanvas: HTMLCanvasElement;
  let chestChartCanvas: HTMLCanvasElement;
  let underNavelChartCanvas: HTMLCanvasElement;

  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setDate(today.getDate() - 30);

  // Helper: format date YYYY-MM-DD
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  onMount(() => {
    // Load measurements from localStorage
    const saved = localStorage.getItem('measurements');
    if (saved) {
      const parsed: MeasurementEntry[] = JSON.parse(saved);

      // Filter last 30 days and sort ascending
      measurements = parsed
        .filter(entry => new Date(entry.date) >= lastMonth)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Load calories from meal tracker localStorage, aggregate by day
    const mealKeys = Object.keys(localStorage).filter(key => key.startsWith('meals-'));
    caloriesByDay = mealKeys.map(key => {
      const meals = JSON.parse(localStorage.getItem(key) || '[]');
      let totalCalories = 0;
      for (const meal of meals) {
        for (const item of meal.items) {
          if (item.nutrition?.calories) totalCalories += item.nutrition.calories;
        }
      }
      return { date: key.replace('meals-', ''), calories: totalCalories };
    }).filter(day => new Date(day.date) >= lastMonth);

    caloriesByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Build charts after DOM ready
    setTimeout(() => {
      buildWeightChart();
      buildCaloriesChart();
      buildMeasurementCharts();
    }, 100);
  });

  function buildWeightChart() {
    if (weightChart) weightChart.destroy();

    weightChart = new Chart(weightChartCanvas, {
      type: 'line',
      data: {
        labels: measurements.map(m => m.date),
        datasets: [{
          label: 'Weight (kg)',
          data: measurements.map(m => m.weight),
          borderColor: '#3b82f6',
          backgroundColor: '#93c5fd44',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: false }
        }
      }
    });
  }

  function buildCaloriesChart() {
    if (caloriesChart) caloriesChart.destroy();

    caloriesChart = new Chart(caloriesChartCanvas, {
      type: 'line',
      data: {
        labels: caloriesByDay.map(c => c.date),
        datasets: [{
          label: 'Calories',
          data: caloriesByDay.map(c => c.calories),
          borderColor: '#10b981',
          backgroundColor: '#6ee7b744',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  function buildMeasurementCharts() {
    // Helper for building a small line chart for a measurement
    function buildSmallChart(canvas: HTMLCanvasElement, label: string, data: number[]) {
      return new Chart(canvas, {
        type: 'line',
        data: {
          labels: measurements.map(m => m.date),
          datasets: [{
            label,
            data,
            borderColor: '#f97316',
            backgroundColor: '#fdba74',
            fill: false,
            tension: 0.3,
            pointRadius: 2,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: false }
          },
          elements: { point: { radius: 0 } }
        }
      });
    }

    buildSmallChart(waistChartCanvas, 'Waist (талия)', measurements.map(m => m.waist));
    buildSmallChart(hipsChartCanvas, 'Hips (ханш)', measurements.map(m => m.hips));
    buildSmallChart(thighChartCanvas, 'Thigh (бедро)', measurements.map(m => m.thigh));
    buildSmallChart(armChartCanvas, 'Arm (ръка)', measurements.map(m => m.arm));
    buildSmallChart(chestChartCanvas, 'Chest (гръдна обиколка)', measurements.map(m => m.chest));
    buildSmallChart(underNavelChartCanvas, 'Under Navel (през пъпа)', measurements.map(m => m.underNavel));
  }
</script>

<h1 class="text-2xl font-bold mb-6">📊 History & Progress</h1>

<div class="max-w-4xl mx-auto space-y-12">
  <section>
    <h2 class="text-lg font-semibold mb-4">Weight Over Last 30 Days</h2>
    <canvas bind:this={weightChartCanvas} class="w-full max-h-80"></canvas>
  </section>

  <section>
    <h2 class="text-lg font-semibold mb-4">Calories Over Last 30 Days</h2>
    <canvas bind:this={caloriesChartCanvas} class="w-full max-h-80"></canvas>
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
