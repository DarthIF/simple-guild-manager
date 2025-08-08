<script lang="ts">
    import Fab, { Icon } from "@smui/fab";

    export function hide() {
        element.getElement().classList.add("smui-fab-hidden");
    }

    export function show() {
        element.getElement().classList.remove("smui-fab-hidden");
    }

    let element: Fab;
    let { icon, onClick } = $props();
</script>

<Fab bind:this={element} class="smui-fab" onclick={onClick}>
    <Icon class="material-symbols-rounded">{icon}</Icon>
</Fab>

<style>
    :global(.smui-fab) {
        position: fixed;
        bottom: 24px;
        right: 24px;
    }

    :global(.smui-fab-hidden) {
        display: none;
    }
</style>
