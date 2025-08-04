<script lang="ts">
    import MaterialSymbols from "../material-symbols.svelte";
    type MaterialSymbolsType = {
        icon?: string;
        onClick?: () => void;
    };

    let { icon, onClick }: MaterialSymbolsType = $props();
</script>

<button class="icon-button" onclick={onClick}>
    <MaterialSymbols {icon} />
</button>

<style>
    @import "./icon-button.css";
</style>
