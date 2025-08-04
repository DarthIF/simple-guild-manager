<script lang="ts">
    import { formatNumberCompact } from "$lib/utils/number-util";
    import MaterialSymbols from "../material-symbols.svelte";

    let {
        memberName = "",
        memberPower = 0,
        onClick = () => {},
        noMemberMode = false,
    } = $props();
</script>

{#if noMemberMode}
    <li class="list-item">Nenhum membro cadastrado</li>
{:else}
    <li class="list-item">
        <div>
            <strong>{memberName}</strong> (Poder: {formatNumberCompact(
                memberPower,
            )})
        </div>
        <div class="list-item-actions">
            <button class="icon-button" onclick={(e) => onClick()}>
                <MaterialSymbols icon="delete" />
            </button>
        </div>
    </li>
{/if}

<style>
    @import "../buttons/icon-button.css";
    @import "./list.css";
</style>
