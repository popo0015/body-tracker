<script lang="ts">
  import { onMount } from "svelte";
  import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
  Chart.register(ArcElement, Tooltip, Legend);

  type Nutrition = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  type MealItem = {
    name: string;
    amount: number;
    unit: string;
    nutrition: Nutrition | null;
  };
  
  type Meal = {
    name: string;
    items: MealItem[];
  };

  const today = new Date().toISOString().split("T")[0];
  const units = ["g", "ml", "tsp", "tbsp", "cup", "piece"];
  const defaultMeals = ["Закуска", "Обяд", "Вечеря", "Снак"];

  let meals: Meal[] = defaultMeals.map((name) => ({ name, items: [] }));
  let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  let chartCanvas: HTMLCanvasElement;
  let pie: Chart;

  onMount(() => {
    const saved = localStorage.getItem("meals-" + today);
    if (saved) {
      meals = JSON.parse(saved);
      recalculateTotal();
    }
  });

  function addProduct(mealIndex: number) {
    meals[mealIndex].items.push({
      name: "",
      amount: 100,
      unit: "g",
      nutrition: null,
    });
  }

  function removeProduct(mealIndex: number, productIndex: number) {
    meals[mealIndex].items.splice(productIndex, 1);
    recalculateTotal();
    saveMeals();
  }

  async function fetchNutrition(mealIndex: number, itemIndex: number) {
    const item = meals[mealIndex].items[itemIndex];
    if (!item.name || !item.amount) return;

    const res = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID,
          "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY,
        },
        body: JSON.stringify({
          query: `${item.amount}${item.unit} ${item.name}`,
        }),
      },
    );

    const data = await res.json();
    if (data.foods?.length > 0) {
      const f = data.foods[0];
      item.nutrition = {
        calories: f.nf_calories,
        protein: f.nf_protein,
        carbs: f.nf_total_carbohydrate,
        fat: f.nf_total_fat,
      };
      recalculateTotal();
      saveMeals();
    }
  }

  function recalculateTotal() {
    total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const meal of meals) {
      for (const item of meal.items) {
        if (item.nutrition) {
          total.calories += item.nutrition.calories;
          total.protein += item.nutrition.protein;
          total.carbs += item.nutrition.carbs;
          total.fat += item.nutrition.fat;
        }
      }
    }

    if (pie) pie.destroy();
    pie = new Chart(chartCanvas, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            label: "Macros",
            data: [total.protein, total.carbs, total.fat],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
          },
        ],
      },
    });
  }

  function saveMeals() {
    localStorage.setItem("meals-" + today, JSON.stringify(meals));
  }
</script>

<h1 class="text-2xl font-bold mb-6">🍽️ Meal Tracker</h1>

<div class="bg-white p-4 rounded shadow mb-6">
  <h2 class="font-semibold mb-2">📊 Daily Overview</h2>
  <p>Calories: {total.calories.toFixed(0)} kcal</p>
  <p>Protein: {total.protein.toFixed(1)} g</p>
  <p>Carbs: {total.carbs.toFixed(1)} g</p>
  <p>Fat: {total.fat.toFixed(1)} g</p>
  <canvas bind:this={chartCanvas} class="mt-4 max-w-xs"></canvas>
</div>

{#each meals as meal, i}
  <div class="bg-gray-100 p-4 rounded shadow mb-6">
    <h3 class="text-lg font-semibold mb-2">{meal.name}</h3>
    {#each meal.items as item, j}
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
        <input
          type="text"
          placeholder="Product"
          bind:value={item.name}
          class="input"
        />
        <input
          type="number"
          min="1"
          placeholder="Amount"
          bind:value={item.amount}
          class="input"
        />
        <select bind:value={item.unit} class="input">
          {#each units as u}
            <option value={u}>{u}</option>
          {/each}
        </select>
        <div class="flex gap-2">
          <button on:click={() => fetchNutrition(i, j)} class="btn px-3"
            >🔍</button
          >
          <button
            on:click={() => removeProduct(i, j)}
            class="btn bg-red-500 hover:bg-red-600">❌</button
          >
        </div>
      </div>
      {#if item.nutrition}
        <p class="text-sm text-gray-600 mb-2 ml-2">
          → {item.nutrition.calories.toFixed(0)} kcal | P: {item.nutrition
            .protein}g C: {item.nutrition.carbs}g F: {item.nutrition.fat}g
        </p>
      {/if}
    {/each}
    <button on:click={() => addProduct(i)} class="btn mt-2"
      >➕ Add Product</button
    >
  </div>
{/each}

<style>
  .input {
    @apply p-2 border rounded w-full;
  }
  .btn {
    @apply px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700;
  }
</style>
