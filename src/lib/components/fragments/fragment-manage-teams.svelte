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
    import { action, basic, fragment_teams } from "$lib/strings/strings";
    import Card, { Content } from "@smui/card";
    import { getAppropriatedString } from "$lib/strings";
    import SmuiDialogConfirm from "../smui/dialogs/smui-dialog-confirm.svelte";
    import SmuiDialogAddMember from "../smui/dialogs/smui-dialog-add-member.svelte";
    import { DialogActions } from "../smui/dialogs/common";

    export function getElementToRender(): HTMLElement {
        return el_cardsGrid;
    }

    export function getGameEvent(): GameEvents {
        return GAME_EVENT;
    }

    function handleAddMember(gameEvent: GameEvents, team: TeamType) {
        el_dialogAddMember.open(gameEvent, team);
    }

    function handleDeleteTeam(gameEvent: GameEvents, team: TeamType) {
        el_dialogConfirm.open(
            {
                label: fragment_teams.dialog_delete_team,
                acceptText: action.delete,
            },
            (e) => {
                // Deletar o time
                if (e.detail.action === DialogActions.ACCEPT) {
                    Database.deleteTeam(gameEvent, team);
                }
            },
        );
    }

    function onDialogClosed(e: CustomEvent<{ action: string }>) {
        el_dialogCreateTeam.close();

        // Botão do dialogo que foi pressionado
        const action = e.detail.action;
        if (action !== "accept") return;

        // Texto digitado no dialogo
        const value = el_dialogCreateTeam.getValue();
        if (value.length < 0) {
            el_dialogConfirm.open({
                title: basic.error,
                label: fragment_teams.error_invalid_name,
            });
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
    let el_dialogConfirm: SmuiDialogConfirm;
    let el_dialogAddMember: SmuiDialogAddMember;
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
                    onAddMemberClick={handleAddMember}
                    onDeleteTeamClick={handleDeleteTeam}
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
<SmuiDialogConfirm bind:this={el_dialogConfirm} />
<SmuiDialogAddMember bind:this={el_dialogAddMember} />

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

    .empty-div h1 {
        padding: 32px;
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

        .empty-div h1 {
            padding: 16px;
            font-size: xx-large;
            line-height: normal;
        }
    }
</style>
