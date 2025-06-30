<script lang="ts">
  import { goto } from '$app/navigation';
  let email = '';
  let password = '';
  let error = '';

  async function login() {
    error = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      goto('/');
    } else {
      const data = await res.json();
      error = data.message || 'Login failed';
    }
  }
</script>

<form on:submit|preventDefault={login} class="max-w-md mx-auto mt-20 p-6 border rounded shadow">
  <h2 class="text-xl mb-4">Login</h2>
  {#if error}
    <p class="text-red-600 mb-4">{error}</p>
  {/if}
  <input type="email" bind:value={email} required placeholder="Email" class="input mb-2" />
  <input type="password" bind:value={password} required placeholder="Password" class="input mb-4" />
  <button type="submit" class="btn w-full">Log In</button>
  <p class="mt-4">No account? <a href="/signup" class="text-blue-600 underline">Sign Up</a></p>
</form>

<style>
  .input {
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .btn {
    background: #2563eb;
    color: white;
    padding: 0.75rem;
    border-radius: 4px;
    font-weight: bold;
  }
</style>
