<script lang="ts">
    import Card, { Content } from "@smui/card";
    import { DateTime } from "luxon";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";
    import { ReactiveSettings } from "$lib/client/settings.svelte";
    import type { AuditLogTypeV3 } from "$lib/common/database/constants-and-types";
    import { AuditLogMessages } from "$lib/client/utils";
    import "$lib/components/css/responsive-margin.css";
    import { onDestroy, onMount } from "svelte";
    import { navigateToFragmentByHash } from "./fragments";

    function getLetter(text: string | null | undefined) {
        const letter = text?.[0];
        return letter !== undefined ? letter : "?";
    }

    function getRelativeTime(unixTime: number) {
        return DateTime.fromMillis(unixTime).toRelative({
            locale: LANG_CODE,
        });
    }

    function getMessage(item: AuditLogTypeV3): string {
        const resolver = AuditLogMessages.get(item.action);
        return resolver ? resolver(item) : `action=${item.action}`;
    }

    function onHashChange(ev: HashChangeEvent) {
        const hash = location.hash;
        navigateToFragmentByHash(hash);
    }

    onMount(() => {
        // Limpar o hash ao abrir o fragmento
        location.hash = "";

        // Adicionar o evento
        window.addEventListener("hashchange", onHashChange);
    });

    onDestroy(() => {
        // Remover o evento
        window.removeEventListener("hashchange", onHashChange);

        // Limpar o hash ao fechar o fragmento
        location.hash = "";
    });

    let LANG_CODE = $derived(ReactiveSettings.lang.code);
</script>

<div class="fragment responsive-margin">
    {#each [...ReactiveDB.auditLog].reverse() as item}
        <Card style="margin-bottom: var(--responsive-margin);">
            <Content>
                <div class="log-item-warper">
                    <div class="log-item-letter">
                        {getLetter(item.user)}
                    </div>

                    <div class="log-item">
                        <span>{@html getMessage(item)}</span>
                        <span>
                            {getRelativeTime(item.unixTime)}
                        </span>
                    </div>
                </div>
            </Content>
        </Card>
    {/each}
</div>

<style>
    .fragment {
        padding: var(--responsive-margin);
    }

    .log-item-warper {
        display: flex;
    }

    .log-item-letter {
        height: 32px;
        aspect-ratio: 1 / 1;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: var(--mdc-theme-secondary);
        color: var(--mdc-theme-on-secondary);
        font-size: medium;
    }

    .log-item {
        margin-left: 12px;

        display: flex;
        flex-direction: column;
    }
</style>
