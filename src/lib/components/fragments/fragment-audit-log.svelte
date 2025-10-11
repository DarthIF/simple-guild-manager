<script>
    import { ReactiveDB } from "$lib/client/reactive-database.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";
</script>

<div class="fragment" id="auditLog">
    {#each ReactiveDB.auditLog as item}
        <div class="log-item-warper">
            <div class="log-item-letter">
                {item?.user?.[0] || "?"}
            </div>

            <div class="log-item">
                <span>{item.user} {item.action}</span>
                <span>{new Date(item.unixTime).toLocaleString()}</span>
            </div>
        </div>
    {/each}
</div>

<style>
    .fragment {
        padding: 16px;
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
