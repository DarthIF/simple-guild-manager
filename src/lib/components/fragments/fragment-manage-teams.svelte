<script lang="ts">
    import {
        Database,
        GameEvents,
        ReactiveData,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { onMount } from "svelte";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
    import SmuiFab from "../smui/smui-fab.svelte";
    import SmuiCardTeam from "../smui/cards/smui-card-team.svelte";
    import EventSelectorV2 from "../event-selectorV2.svelte";
    import { fragment_teams } from "$lib/strings/strings";
    import Card, { Content } from "@smui/card";
    import { getAppropriatedString } from "$lib/strings";

    type ExportType = {
        onAddMemberClick: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick: (gameEvent: GameEvents, team: TeamType) => void;
    };

    export function getElementToRender(): HTMLElement {
        return el_cardsGrid;
    }

    export function getGameEvent(): GameEvents {
        return GAME_EVENT;
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
        Database.addTeam(GAME_EVENT, value);
    }

    // --------------------------------

    let GAME_EVENT: GameEvents = $state(GameEvents.WORLD_TREE);
    let EVENT_TEAMS: TeamType[] = $derived(Database.getEventTeams(GAME_EVENT));

    let el_cardsGrid: HTMLDivElement;
    let el_dialogCreateTeam: SmuiDialogPrompt;

    let { onAddMemberClick, onDeleteTeamClick }: ExportType = $props();
</script>

<EventSelectorV2 class="event-selector" bind:selected={GAME_EVENT} />

<div bind:this={el_cardsGrid}>
    <!-- Nenhuma equipe -->
    {#if EVENT_TEAMS.length < 1}
        <div class="empty-div">
            <Card>
                <Content>
                    <h1>{getAppropriatedString(fragment_teams.no_teams)}</h1>
                </Content>
            </Card>
        </div>
    {:else}
        <div class="cards-responsive-grid">
            {#each EVENT_TEAMS as team, index}
                <SmuiCardTeam
                    {index}
                    {team}
                    {onAddMemberClick}
                    {onDeleteTeamClick}
                    gameEvent={GAME_EVENT}
                />
            {/each}
        </div>
    {/if}
</div>

<SmuiFab
    icon="add"
    onClick={() => {
        el_dialogCreateTeam.open(onDialogClosed);
    }}
/>
<SmuiDialogPrompt
    title={fragment_teams.dialog_new_team}
    label={fragment_teams.dialog_team_name}
    bind:this={el_dialogCreateTeam}
/>

<style>
    :global(.event-selector) {
        padding: 16px;
        padding-bottom: 8px;
    }

    .empty-div {
        padding-top: 72px;

        display: flex;
        align-items: center;
        justify-content: center;

        user-select: none;
    }

    .cards-responsive-grid {
        padding: 16px;
        padding-top: 8px;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
    }

    /* Styles applied for screens up to 768px wide */
    @media screen and (max-width: 768px) {
        .empty-div {
            padding: 16px;
            padding-top: 8px;
        }
    }
</style>
