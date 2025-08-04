<script lang="ts">
    import {
        calculateTeamPowerToDisplay,
        Database,
        GameEvents,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { ReactiveSettings } from "$lib/utils/reactive-settings.svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialButton from "../buttons/material-button.svelte";
    import MaterialIconButton from "../buttons/material-icon-button.svelte";

    type CardTeamType = {
        team: TeamType;
        gameEvent: GameEvents;
        onAddMemberClick: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick: (gameEvent: GameEvents, team: TeamType) => void;
    };

    let { team, gameEvent, onAddMemberClick, onDeleteTeamClick }: CardTeamType =
        $props();
</script>

<div class="card team-card">
    <div class="card-title team-card-title">
        <span>{team.name}</span>

        <!-- Botão para deletar o timeX -->
        {#if !ReactiveSettings.screenShotMode}
            <MaterialIconButton
                icon="delete"
                onClick={() => onDeleteTeamClick(gameEvent, team)}
            />
        {/if}
    </div>

    <!-- Membros da equipe -->
    <div class="team-member-list">
        {#each team.members as memberId}
            <div class="team-member">
                <div>{Database.findMemberToDisplay(memberId)}</div>

                <!-- Botão para remover o membro do time -->
                {#if !ReactiveSettings.screenShotMode}
                    <MaterialIconButton
                        icon="person_remove"
                        onClick={() => {
                            Database.removeMemberFromTeamV2(
                                gameEvent,
                                team.id,
                                memberId,
                            );
                        }}
                    />
                {/if}
            </div>
        {/each}
    </div>

    <!-- Botão para adicionar um membro -->
    {#if !ReactiveSettings.screenShotMode}
        {#if team.members.length < 4}
            <MaterialButton
                type={ButtonTypes.PRIMARY}
                onClick={() => onAddMemberClick(gameEvent,team)}
            >
                Adicionar Membro
            </MaterialButton>
        {/if}
    {/if}

    <!-- Mostrar o poder total -->
    <div class="team-power">
        Poder Total: {calculateTeamPowerToDisplay(team)}
    </div>
</div>

<style>
    @import "./card.css";

    .team-card {
        position: relative;
        margin: 0 !important;

        display: flex;
        flex-direction: column;
    }

    .team-card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .team-member-list {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .team-member {
        padding: 8px 0;

        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 1px solid #eee;
    }

    .team-member:last-child {
        border-bottom: none;
    }

    .team-power {
        margin-top: 16px;
        font-weight: 500;
        text-align: right;
    }
</style>
