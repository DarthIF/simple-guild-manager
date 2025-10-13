<script lang="ts">
    import Card, { Content } from "@smui/card";
    import { DateTime } from "luxon";
    import { ReactiveDB } from "$lib/client/reactive-database.svelte";
    import { ReactiveSettings } from "$lib/client/settings.svelte";
    import type { AuditLogTypeV3 } from "$lib/common/database/constants-and-types";
    import { AuditLogMessageResolvers } from "$lib/client/utils";
    import "$lib/components/css/responsive-margin.css"; 

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
        const resolver = AuditLogMessageResolvers.get(item.action);
        return resolver ? resolver(item) : `action=${item.action}`;
    }

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
                        <span>{getMessage(item)}</span>
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
