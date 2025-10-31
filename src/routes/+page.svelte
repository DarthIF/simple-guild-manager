<script lang="ts">
    import WebApp from "$lib/components/core/web-app.svelte";
    import { BrowserDatabase } from "$lib/client/browser-database.svelte";
    import { onMount } from "svelte";
    import { ReactiveSettings } from "$lib/client/settings.svelte";
    import LoadingLoader from "$lib/components/misc/loading-loader.svelte";
    import "$lib/components/css/glass.css";
    import Card, { Content } from "@smui/card";
    import { getAppropriatedString } from "$lib/strings";
    import { basic, fragment_home } from "$lib/strings/strings";
    import { ReactiveDB } from "$lib/client/reactive-database.svelte";

    onMount(() => {
        ReactiveSettings.loading = true;
        database.loadData().then((v) => {
            console.log(v);

            if (!v) {
                alert("Database load error");
            }

            ReactiveSettings.loading = false;
        });
    });

    let database = $state(BrowserDatabase);
</script>

<WebApp
    bind:database
    title={ReactiveDB.definitions.guild}
    subtitle={getAppropriatedString(basic.subtitle)}
    enableProfileButton={ReactiveSettings.isGithubPages === false}
    onClickListenerProfileButton={() => {
        location.assign("/login");
    }}
>
    <Card>
        <Content>
            <div style="padding: 1rem;">
                <h6 class="title">
                    {getAppropriatedString(fragment_home.no_sync_greeting)}
                </h6>
                <div class="subtitle">
                    <p>
                        {getAppropriatedString(fragment_home.no_sync_line_1)}
                    </p>
                    <p>
                        {getAppropriatedString(fragment_home.no_sync_line_2)}
                    </p>
                </div>
            </div>
        </Content>
    </Card>
</WebApp>

{#if ReactiveSettings.loading}
    <div class="loader-view fill">
        <div class="loader-background glass-background"></div>
        <div class="loader-content fill">
            <LoadingLoader />
        </div>
    </div>
{/if}

<style>
    .title {
        margin: 0;
    }

    .subtitle {
        color: #888;
    }

    .loader-view {
        z-index: 9999;
        position: fixed;

        overflow: hidden;
        user-select: none;
    }

    .loader-background {
        width: 100%;
        height: 100%;
    }

    .loader-content {
        z-index: 1;
        position: absolute;

        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--mdc-theme-background);
        font-size: 48pt;
        -webkit-text-stroke: 2px var(--mdc-theme-text-primary-on-background);
    }

    .fill {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
