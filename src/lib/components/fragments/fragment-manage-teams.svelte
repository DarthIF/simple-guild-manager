<script lang="ts">
    import {
        Database,
        GameEvents,
        ReactiveData,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialButton from "../buttons/material-button.svelte";
    import CardTeam from "../cards/card-team.svelte";
    import EventSelector from "../event-selector.svelte";
    import MaterialSymbols from "../material-symbols.svelte";

    type FragmentManageTeamsType = {
        onAddMemberClick: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick: (gameEvent: GameEvents, team: TeamType) => void;
    };

    export function getElementToRender(): HTMLElement {
        return root;
    }

    export function getCurrentGameEvent(): GameEvents {
        return currentGameEvent;
    }

    let currentGameEvent: GameEvents = $state(GameEvents.WORLD_TREE);
    let currentEventTeams = $derived(Database.getEventTeams(currentGameEvent));
    let root: HTMLDivElement;

    let { onAddMemberClick, onDeleteTeamClick }: FragmentManageTeamsType =
        $props();
</script>

<EventSelector
    style="padding: 16px;"
    currentEvent={currentGameEvent}
    onSelectionListener={(gameEvent) => {
        currentGameEvent = gameEvent;
    }}
/>

<div class="fragment" bind:this={root}>
    {#if currentEventTeams.length < 1}
        <!-- Nenhuma equipe -->
        <div class="card" style="display: flex; align-items: center; justify-content: center;">
            <span>Nenhuma equipe criada. Clique no botão</span>
            <MaterialSymbols icon="add" />
            <span>para criar uma.</span>
        </div>
    {:else}
        <div class="team-grid">
            {#each currentEventTeams as team}
                <CardTeam
                    {team}
                    {onAddMemberClick}
                    {onDeleteTeamClick}
                    gameEvent={currentGameEvent}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    @import "../cards/card.css";

    .fragment {
        padding: 16px;
        padding-top: 0;
    }

    .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
    }
</style>
