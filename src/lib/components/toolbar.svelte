<script lang="ts">
    import { ReactiveData } from "$lib/utils/reactive-database.svelte";
    import MaterialSymbols from "./material-symbols.svelte";
    type ToolbarTypes = {
        showExportImage?: boolean;
        onDrawerClick?: (e: any) => void;
        onExportImgClick?: (e: any) => void;
    };

    let { showExportImage, onDrawerClick, onExportImgClick }: ToolbarTypes = $props();
</script>

<div class="toolbar">
    <button class="toolbar-button menu-button" onclick={onDrawerClick}>
        <MaterialSymbols icon="menu" />
    </button>
    <h1 class="toolbar-title">{ReactiveData.organization}</h1>
    {#if showExportImage}
        <button class="toolbar-button" onclick={onExportImgClick}>
            <MaterialSymbols icon="image" />
        </button>
    {/if}
</div>

<style>
    .toolbar {
        z-index: 10;
        height: auto;
        min-height: 72px;
        position: relative;
        padding: 16px;

        background-color: var(--primary-color);
        color: var(--on-primary);

        display: flex;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

        user-select: none;
    }

    .toolbar-title {
        flex-grow: 1;
        font-size: 1.5rem;
        font-weight: 500;
        margin-left: 16px;
    }

    .toolbar-button {
        padding: 8px;

        border: none;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        background: none;
        color: var(--on-primary);

        cursor: pointer;
    }

    .menu-button {
        display: flex !important;
    }

    .menu-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* Responsive adjustments */
    @media (min-width: 992px) {
        .menu-button {
            display: none !important;
        }
    }
</style>
