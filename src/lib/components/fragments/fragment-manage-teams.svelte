<script lang="ts">
    import {
        Database,
        GameEvents,
        ReactiveData,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { onMount } from "svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialButton from "../buttons/material-button.svelte";
    import CardTeam from "../cards/card-team.svelte";
    import EventSelector from "../event-selector.svelte";
    import MaterialSymbols from "../material-symbols.svelte";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
    import SmuiFab from "../smui/smui-fab.svelte";

    type FragmentManageTeamsType = {
        onAddMemberClick: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick: (gameEvent: GameEvents, team: TeamType) => void;
    };

    export function getElementToRender(): HTMLElement {
        return el_root;
    }

    export function getCurrentGameEvent(): GameEvents {
        return currentGameEvent;
    }

    function onDialogClosed(e: CustomEvent<{ action: string }>) {
        el_dialogCreateTeam.close();

        // Botão do dialogo que foi pressionado
        const action = e.detail.action;
        if (action !== "accept") return;

        // Texto digitado no dialogo
        const value = el_dialogCreateTeam.getValue();
        if (value.length < 0) {
            alert("INVALID NAME");
            return;
        }

        // Criar o time
        Database.addTeam(currentGameEvent, value);
    }

    onMount(() => {
        el_dialogCreateTeam.setOnDialogClosed(onDialogClosed);
    });

    let currentGameEvent: GameEvents = $state(GameEvents.WORLD_TREE);
    let currentEventTeams = $derived(Database.getEventTeams(currentGameEvent));

    let el_root: HTMLDivElement;
    let el_dialogCreateTeam: SmuiDialogPrompt;

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

<div class="fragment" bind:this={el_root}>
    {#if currentEventTeams.length < 1}
        <!-- Nenhuma equipe -->
        <div
            class="card"
            style="display: flex; align-items: center; justify-content: center;"
        >
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

<SmuiFab
    icon="add"
    onClick={() => {
        el_dialogCreateTeam.open();
    }}
/>
<SmuiDialogPrompt bind:this={el_dialogCreateTeam} />

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
