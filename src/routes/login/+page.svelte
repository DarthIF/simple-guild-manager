<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import { getLocalizedErrorMessage } from "$lib/common/login/error-messages";
    import "$lib/components/css/login-styles.css";
    import "animate.css";

    onMount(() => {
        el_card.addEventListener("animationend", () => {
            el_main.classList.remove("main-interact-block");
        });
    });

    let el_main: HTMLElement;
    let el_card: HTMLDivElement;

    let { data, form }: PageProps = $props();
</script>

<main bind:this={el_main} class="main-interact-block">
    <div class="background"></div>
    <div bind:this={el_card} class="card animate__animated animate__fadeInUp">
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

            <!-- Mensagem de erro -->
            {#if form?.message}
                <div class="error-message animate__animated animate__shakeX">
                    {getLocalizedErrorMessage(form.message)}
                </div>
            {/if}

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

<style>
</style>
