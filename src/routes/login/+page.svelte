<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import "$lib/components/css/login-styles.css";

    let { data, form }: PageProps = $props();
</script>

<main>
    <div class="background"></div>
    <div class="card">
        <form action="?/login" method="POST" use:enhance>
            <h1>Login</h1>

            <div class="input-box">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                />
                <span class="material-symbols-rounded">person</span>
            </div>
            <div class="input-box">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <span class="material-symbols-rounded">lock</span>
            </div>

            <button type="submit" class="btn">Login</button>

            {#if data.ENABLE_USER_REGISTRATION}
                <div class="register-link">
                    <p>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            {/if}
        </form>
    </div>
</main>
