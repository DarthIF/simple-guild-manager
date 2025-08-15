<script lang="ts">
    import Fab, { Icon } from "@smui/fab";

    export function hide() {
        visibility = false;
    }

    export function show() {
        visibility = true;
    }

    let visibility = $state(true);
    let { icon, onClick } = $props();
</script>

{#if visibility}
    <Fab class="smui-fab" onclick={onClick}>
        <Icon class="material-symbols-rounded">{icon}</Icon>
    </Fab>
{/if}

<style>
    :global(.smui-fab) {
        position: fixed !important;
        bottom: 24px;
        right: 24px;
    }
</style>
