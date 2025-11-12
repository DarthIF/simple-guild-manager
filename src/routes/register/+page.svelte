<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import { getLocalizedErrorMessage } from "$lib/common/login/error-messages";
    import "$lib/components/css/login-styles.css";
    import "animate.css";
    import type { Undefinable } from "$lib/utils/types";

    onMount(() => {
        el_card?.addEventListener("animationend", () => {
            el_main?.classList.remove("main-interact-block");
        });

        if (data.ENABLE_USER_REGISTRATION !== true) {
            location.assign("/error");
        }
    });

    let password1 = $state("");
    let password2 = $state("");
    let equalsPassword = $derived(password1 === password2);

    let el_main: Undefinable<HTMLElement> = $state();
    let el_card: Undefinable<HTMLDivElement> = $state();

    let { data, form }: PageProps = $props();
</script>

{#if data.ENABLE_USER_REGISTRATION}
    <main bind:this={el_main}>
        <div class="background"></div>
        <div
            bind:this={el_card}
            class="card register-card animate__animated animate__fadeInUp"
        >
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

                <!-- Mensagem de erro -->
                {#if form?.message}
                    <div
                        class="error-message animate__animated animate__shakeX"
                    >
                        {getLocalizedErrorMessage(form.message)}
                    </div>
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
