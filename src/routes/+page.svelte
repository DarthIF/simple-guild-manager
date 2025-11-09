<script lang="ts">
    import { onMount } from "svelte";
    import WebApp from "$lib/components/core/web-app.svelte";
    import WebAppWindow from "$lib/components/core/web-app-window.svelte";
    import Card, { Content } from "@smui/card";
    import { BrowserDatabase } from "$lib/client/browser-database.svelte";
    import { ReactiveSettings } from "$lib/client/settings.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { basic, fragment_home } from "$lib/strings/strings";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";
    import type { Nullable } from "$lib/utils/types";
    import LoaderLayoutFullPage from "$lib/components/misc/loaders/loader-layout-full-page.svelte";

    onMount(() => {
        ReactiveSettings.loading = true;
        database.loadData().then((v) => {
            console.log(v);

            if (!v) {
                alert("Database load error");
            }

            ReactiveSettings.loading = false;
        });

        if (!ReactiveSettings.isGithubPages) {
            pageStatus = "Browser Mode";
        } else {
            pageStatus = null;
        }
    });

    let pageStatus = $state<Nullable<string>>(null);
    let database = $state(BrowserDatabase);
</script>

<WebAppWindow bind:status={pageStatus}>
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
                            {getAppropriatedString(
                                fragment_home.no_sync_line_1,
                            )}
                        </p>
                        <p>
                            {getAppropriatedString(
                                fragment_home.no_sync_line_2,
                            )}
                        </p>
                    </div>
                </div>
            </Content>
        </Card>
    </WebApp>
</WebAppWindow>

<LoaderLayoutFullPage bind:enable={ReactiveSettings.loading} />

<style>
    .title {
        margin: 0;
    }

    .subtitle {
        color: #888;
    }
</style>
