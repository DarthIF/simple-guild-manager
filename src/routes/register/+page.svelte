<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import "$lib/components/css/login-styles.css";

    let { data, form }: PageProps = $props();
</script>

{#if data.ENABLE_USER_REGISTRATION}
    <main>
        <div class="card">
            <form action="?/register" method="POST" use:enhance>
                <h1>Register</h1>

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

                <div class="register-link">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    </main>
{/if}
