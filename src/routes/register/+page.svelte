<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import "$lib/components/css/login-styles.css";

    onMount(() => {
        if (data.ENABLE_USER_REGISTRATION) return;
        location.assign("/error");
    });

    let password1 = $state("");
    let password2 = $state("");
    let equalsPassword = $derived(password1 === password2);

    let { data, form }: PageProps = $props();
</script>

{#if data.ENABLE_USER_REGISTRATION}
    <main>
        <div class="background"></div>
        <div class="card register-card">
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
                        name="password_1"
                        placeholder="Type password"
                        required
                        bind:value={password1}
                    />
                    <span class="material-symbols-rounded">lock</span>
                </div>
                <div class="input-box">
                    <input
                        type="password"
                        name="password_2"
                        placeholder="Repeat password"
                        required
                        bind:value={password2}
                    />
                    <span class="material-symbols-rounded">lock</span>
                </div>

                {#if equalsPassword}
                    <button type="submit" class="btn">Register User</button>
                {:else}
                    <button type="button" class="btn password-warm" disabled>
                        The password must be the same
                    </button>
                {/if}

                <div class="register-link">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    </main>
{/if}

<style>
    .password-warm {
        --color: #f44336;
        --color-inverse: #ffcdd2;

        cursor: not-allowed;
    }

    .register-card {
        background: rgba(0, 0, 0, 0.36);
    }
</style>
