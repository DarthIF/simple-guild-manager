<script lang="ts">
    import type { HTMLStyleAttributes } from "svelte/elements";
    import { GameEvents } from "$lib/utils/reactive-database.svelte";
    import { ButtonTypes } from "./remover/buttons/button-types";
    import MaterialButton from "./remover/buttons/material-button.svelte";
    type EventSelectorType = {
        style?: string;
        currentEvent: GameEvents;
        onSelectionListener?: (gameEvent: GameEvents) => void;
    };

    function getPrimary(primary: boolean): ButtonTypes {
        return primary ? ButtonTypes.PRIMARY : ButtonTypes.SECONDARY;
    }

    function handleClick(gameEvent: GameEvents) {
        onSelectionListener?.(gameEvent);
    }

    let { style, currentEvent, onSelectionListener }: EventSelectorType = $props();
</script>

<div class="scroll-warper" {style}>
    <div class="event-selector">
        <MaterialButton
            type={getPrimary(currentEvent === GameEvents.WORLD_TREE)}
            onClick={() => handleClick(GameEvents.WORLD_TREE)}
        >
            World Tree
        </MaterialButton>

        <MaterialButton
            type={getPrimary(currentEvent === GameEvents.MINES_IN_DUNGEON)}
            onClick={() => handleClick(GameEvents.MINES_IN_DUNGEON)}
        >
            Mines in Dungeon
        </MaterialButton>

        <MaterialButton
            type={getPrimary(currentEvent === GameEvents.CLOUD_KINGDOM)}
            onClick={() => handleClick(GameEvents.CLOUD_KINGDOM)}
        >
            Cloud Kingdom
        </MaterialButton>

        <MaterialButton
            type={getPrimary(currentEvent === GameEvents.CASSINO_ON_YACHT)}
            onClick={() => handleClick(GameEvents.CASSINO_ON_YACHT)}
        >
            Cassino on Yacht
        </MaterialButton>
    </div>
</div>

<style>
    .scroll-warper {
        width: 100%;
        height: auto;

        overflow-x: auto;
        overflow-y: hidden;
    }

    .event-selector {
        width: max-content;
        height: inherit;

        display: block;
    }
</style>
