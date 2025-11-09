<script lang="ts">
    import type { NullableU } from "$lib/utils/types";

    type ExportType = {
        status?: NullableU<string>;
        children: any;
    };
    let { status = $bindable(null), children }: ExportType = $props();
</script>

<div class="web-app-root">
    {#if status && status !== ""}
        <div class="status-bar">
            <div>
                {status}
            </div>
        </div>
    {/if}
    {@render children?.()}
</div>

<style>
    .web-app-root {
        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: column;
    }

    .status-bar {
        background-color: var(--mdc-theme-primary);
        user-select: none;
    }

    .status-bar > div {
        background: rgba(0, 0, 0, 0.38);
        text-align: center;
    }
</style>
