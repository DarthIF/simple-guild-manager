<script lang="ts">
    import { GameEvents } from "$lib/utils/reactive-database.svelte";
    import Button, { Label } from "@smui/button";
    import HorizontalScrollWarper from "./misc/horizontal-scroll-warper.svelte";

    type ExportType = { class?: string; style?: string; selected?: GameEvents };

    function getVariant(target: GameEvents) {
        if (selected === target) {
            return "unelevated";
        }

        return "outlined";
    }

    function handleClick(gameEvent: GameEvents) {
        if (selected === gameEvent) return;
        selected = gameEvent;
    }

    let {
        class: className = "",
        style = "",
        selected = $bindable(),
    }: ExportType = $props();
</script>

<HorizontalScrollWarper class={className} {style}>
    <Button
        onclick={() => handleClick(GameEvents.WORLD_TREE)}
        variant={getVariant(GameEvents.WORLD_TREE)}
    >
        <Label>World Tree</Label>
    </Button>

    <Button
        onclick={() => handleClick(GameEvents.MINES_IN_DUNGEON)}
        variant={getVariant(GameEvents.MINES_IN_DUNGEON)}
    >
        <Label>Mines in Dungeon</Label>
    </Button>

    <Button
        onclick={() => handleClick(GameEvents.CLOUD_KINGDOM)}
        variant={getVariant(GameEvents.CLOUD_KINGDOM)}
    >
        <Label>Cloud Kingdom</Label>
    </Button>

    <Button
        onclick={() => handleClick(GameEvents.CASSINO_ON_YACHT)}
        variant={getVariant(GameEvents.CASSINO_ON_YACHT)}
    >
        <Label>Cassino on Yacht</Label>
    </Button>
</HorizontalScrollWarper>
