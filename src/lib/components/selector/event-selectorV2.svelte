<script lang="ts">
    import Button, { Label } from "@smui/button";
    import HorizontalScrollWarper from "../misc/horizontal-scroll-warper.svelte";
    import { GameEvents } from "$lib/common/database/enums";

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

    type ExportType = { class?: string; style?: string; selected?: GameEvents };
    let {
        class: className = "",
        style = "",
        selected = $bindable(),
    }: ExportType = $props();
</script>

<HorizontalScrollWarper class={className} {style}>
    <Button
        variant={getVariant(GameEvents.WORLD_TREE)}
        onclick={() => handleClick(GameEvents.WORLD_TREE)}
    >
        <Label>World Tree</Label>
    </Button>

    <Button
        variant={getVariant(GameEvents.MINES_IN_DUNGEON)}
        onclick={() => handleClick(GameEvents.MINES_IN_DUNGEON)}
    >
        <Label>Mines in Dungeon</Label>
    </Button>

    <Button
        variant={getVariant(GameEvents.CLOUD_KINGDOM)}
        onclick={() => handleClick(GameEvents.CLOUD_KINGDOM)}
    >
        <Label>Cloud Kingdom</Label>
    </Button>

    <Button
        variant={getVariant(GameEvents.CASSINO_ON_YACHT)}
        onclick={() => handleClick(GameEvents.CASSINO_ON_YACHT)}
    >
        <Label>Cassino on Yacht</Label>
    </Button>
</HorizontalScrollWarper>
