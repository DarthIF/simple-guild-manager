<script lang="ts">
    type ExportTypes = {
        server?: number;
        tag?: string;
        name?: string;
    };
    let { server, tag, name }: ExportTypes = $props();
</script>

{#if server}
    <span class="server">[{server}]</span>
{/if}

{#if tag && tag !== ""}
    <span class="normal-text">({tag})</span>
{/if}

{#if name}
    <span class="normal-text">{name}</span>
{/if}

<style>
    .server {
        color: var(--mdc-theme-primary);
    }
    .normal-text {
    }
</style>
