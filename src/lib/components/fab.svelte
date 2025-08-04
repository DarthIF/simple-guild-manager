<script lang="ts">
    import MaterialSymbols from "./material-symbols.svelte";

    type FabType = {
        onClick?: () => void;
    };

    export function hide() {
        el_fab.classList.add("fab-hidden");
    }

    export function show() {
        el_fab.classList.remove("fab-hidden");
    }

    let el_fab: HTMLButtonElement;
    let { onClick }: FabType = $props();
</script>

<button
    class="fab fab-hidden"
    bind:this={el_fab}
    onclick={() => {
        onClick?.();
    }}
>
    <MaterialSymbols icon="add" />
</button>

<style>
    .fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        border: none;
        z-index: 5;
    }

    .fab:hover {
        background-color: var(--primary-dark);
    }

    .fab-hidden {
        display: none;
    }
</style>
