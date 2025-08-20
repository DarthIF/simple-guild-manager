<script lang="ts">
    type MaterialSymbolsType = {
        icon?: string;
    };

    let { icon }: MaterialSymbolsType = $props();
</script>

<span class="material-symbols-rounded">{icon}</span>

<style>
    @import "./material-symbols.css";
</style>
