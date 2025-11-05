<script lang="ts">
    import type { PageProps } from "./$types";
    import { onMount } from "svelte";
    import Card, { Content } from "@smui/card";
    import WebApp from "$lib/components/core/web-app.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { fragment_home } from "$lib/strings/strings";
    import { ClientDatabase } from "$lib/client/client-database.svelte";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";
    import AppSync from "$lib/components/core/app-sync.svelte";
    import "animate.css";

    onMount(() => {
        database.downloadDatabase().then(() => {
            card_display = "flex";
            card_animation = "animate__fadeInUp";
        });
    });

    let database = $state(ClientDatabase);
    let card_display = $state("none");
    let card_animation = $state("");

    let { data }: PageProps = $props();
</script>

<WebApp
    bind:database
    title={ReactiveDB.definitions.guild}
    subtitle="Connected as: {data.name}"
    enableProfileButton={true}
    onClickListenerProfileButton={() => {
        alert("not implemented");
    }}
>
    <Card
        class={`animate__animated ${card_animation}`}
        style={`margin: 0 16px; display: ${card_display};`}
    >
        <Content>
            <div style="padding: 1rem;">
                <h6 class="title">
                    {getAppropriatedString(
                        fragment_home.database_greeting,
                        data.name,
                    )}
                </h6>
                <div class="subtitle">
                    <p>
                        {@html getAppropriatedString(
                            fragment_home.database_line_1,
                            '<span style="transform: translateY(25%);" class="material-symbols-rounded">database</span>',
                        )}
                    </p>
                    <p>
                        {getAppropriatedString(fragment_home.database_line_2)}
                    </p>
                </div>
            </div>
        </Content>
    </Card>
</WebApp>

<AppSync token={data.token} />

<style>
    .title {
        margin: 0;
    }

    .subtitle {
        color: #888;
    }
</style>
