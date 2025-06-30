<script lang="ts">
  interface PageData {
    user?: { id: string; email: string } | null;
    entry?: any;
  }

  export let data: PageData;
  const user = data.user;
  const today = new Date().toISOString().slice(0, 10);
</script>

{#if user}
  <!-- Show your dashboard -->
  <main>  
    <h1 class="text-3xl font-bold text-center">🏋️‍♀️ Fit Tracker</h1>
    <p class="text-center text-gray-600">Здравей, {user.email}! 📅 Днес е <strong>{today}</strong></p>
    <!-- Your cards here... -->
  </main>
{:else}
  <!-- Show login/signup options -->
  <main class="max-w-md mx-auto p-6 mt-20 text-center">
    <h1 class="text-2xl font-bold mb-4">Welcome to Fit Tracker 💪</h1>
    <p class="mb-6">Please <a href="/login" class="text-blue-600 underline">Log In</a> or <a href="/signup" class="text-blue-600 underline">Sign Up</a> to get started.</p>
  </main>
{/if}

<style>
  a {
    cursor: pointer;
  }
</style>
