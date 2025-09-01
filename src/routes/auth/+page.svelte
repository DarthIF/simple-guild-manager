<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { Icon, Label } from "@smui/common";
    import Button from "@smui/button";
    import Card, { Content } from "@smui/card";
    import Textfield from "@smui/textfield";
    import { onMount } from "svelte";
    import NextjsErrorView from "$lib/components/misc/nextjs-error-view.svelte";

    function onHashChange() {
        if (location.hash === "#login") {
            current_mode = MODE_LOGIN;
        } else if (location.hash === "#register") {
            current_mode = MODE_REGISTER;
        }
    }

    onMount(() => {
        window.addEventListener("hashchange", onHashChange);
        onHashChange();
    });

    const MODE_LOGIN = 1;
    const MODE_REGISTER = 2;
    let value_username = $state("");
    let value_password = $state("");
    let current_mode = $state(MODE_LOGIN);

    let { data, form }: PageProps = $props();
</script>

<main>
    {#if current_mode === MODE_REGISTER && data.ENABLE_USER_REGISTRATION}
        <!-- Card para o registro -->
        <Card class="card-login">
            <Content>
                <div class="card-header">
                    <Icon class="material-symbols-rounded card-icon">
                        security
                    </Icon>

                    <div class="card-title">Join us today</div>
                    <div>
                        Already have an account?
                        <a href="#login">Login</a>
                    </div>
                </div>

                <!-- Formulário -->
                <form action="?/register" method="POST" use:enhance>
                    <Textfield
                        bind:value={value_username}
                        input$id="username"
                        input$name="username"
                        required
                        variant="outlined"
                        label="User"
                        type="text"
                    />
                    <Textfield
                        bind:value={value_password}
                        input$id="password"
                        input$name="password"
                        required
                        variant="outlined"
                        label="Password"
                        type="password"
                    />

                    <Button type="submit">
                        <Label>Register</Label>
                    </Button>

                    {JSON.stringify(form)}
                </form>
            </Content>
        </Card>
    {:else if current_mode === MODE_LOGIN}
        <!-- Card para o login -->
        <Card class="card-login">
            <Content>
                <div class="card-header">
                    <Icon class="material-symbols-rounded card-icon">
                        security
                    </Icon>

                    <div class="card-title">Welcome Back</div>
                    <div>
                        Don't have an account yet?
                        {#if data.ENABLE_USER_REGISTRATION}
                            <a href="#register">Sing Up</a>
                        {/if}
                    </div>
                </div>

                <!-- Formulário -->
                <form action="?/login" method="POST" use:enhance>
                    <Textfield
                        bind:value={value_username}
                        input$id="username"
                        input$name="username"
                        required
                        variant="outlined"
                        label="User"
                        type="text"
                    />
                    <Textfield
                        bind:value={value_password}
                        input$id="password"
                        input$name="password"
                        required
                        variant="outlined"
                        label="Password"
                        type="password"
                    />

                    <Button type="submit">
                        <Label>Login</Label>
                    </Button>

                    {JSON.stringify(form)}
                </form>
            </Content>
        </Card>
    {:else}
        <NextjsErrorView code="500" message="Internal server error." />
    {/if}
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        overflow-x: hidden;
        overflow-y: auto;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    :global(form > * ~ *) {
        margin-top: 8px;
    }

    :global(.card-login) {
        width: 360px;
    }

    .card-header {
        margin-bottom: 24px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-title {
        font-size: 1.25rem;
    }

    :global(.card-icon) {
        margin-bottom: 16px;
        color: var(--mdc-theme-primary);
        font-size: 3rem;
        user-select: none;
    }
</style>
