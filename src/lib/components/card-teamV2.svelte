<script lang="ts">
    import { getAppropriatedString } from "$lib/strings";
    import { component_card_team } from "$lib/strings/strings";
    import { getColorListItemForIndex } from "$lib/utils/color-list";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import {
        calculateTeamPowerToDisplay,
        Database,
        type GameEvents,
        type MemberType,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { ReactiveSettings } from "$lib/utils/reactive-settings.svelte";
    import IconButton from "@smui/icon-button";
    import { onMount } from "svelte";

    type ExportType = {
        index?: number;
        team: TeamType;
        gameEvent: GameEvents;
        onAddMemberClick?: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick?: (gameEvent: GameEvents, team: TeamType) => void;
    };

    function onClick_RemoveMember(member: MemberType | undefined) {
        if (!member) return;
        Database.removeMemberFromTeamV2(gameEvent, team.id, member.id);
    }

    onMount(() => {});

    $effect(() => {
        if (!el_card) return;

        const color = getColorListItemForIndex(index);

        el_card.style.setProperty("--card-background", color.surface);
        el_card.style.setProperty("--card-text", color.text_primary);
    });

    let el_card: HTMLDivElement | undefined = $state(undefined);

    let {
        index = 0,
        team,
        gameEvent,
        onAddMemberClick = undefined,
        onDeleteTeamClick = undefined,
    }: ExportType = $props();
</script>

{#if team}
    <div bind:this={el_card} class="card-compat">
        <!-- Cabeçalho -->
        <div class="card-header">
            <!-- Titulo -->
            <div class="two-lines-text">
                <span>
                    {team?.name}
                </span>
                <span>
                    {getAppropriatedString(component_card_team.total_power)}
                    {calculateTeamPowerToDisplay(team)}
                </span>
            </div>

            <!-- Ações -->
            <div class="card-header-actions">
                <!-- Botões para gerenciar o time -->
                {#if !ReactiveSettings.screenShotMode}
                    <!-- Botão para adicionar um membro -->
                    {#if team.members.length < 4}
                        <IconButton
                            class="material-symbols-rounded"
                            onclick={() => {
                                if (gameEvent && onAddMemberClick) {
                                    onAddMemberClick(gameEvent, team);
                                }
                            }}
                        >
                            person_add
                        </IconButton>
                    {/if}
                    <!-- Botão para apagar o time -->
                    <IconButton
                        class="material-symbols-rounded"
                        onclick={() => {
                            if (gameEvent && onDeleteTeamClick) {
                                onDeleteTeamClick(gameEvent, team);
                            }
                        }}
                    >
                        delete
                    </IconButton>
                {/if}
            </div>
        </div>

        <!-- Lista -->
        <ul class="card-list">
            {#each team.members.map(Database.findMember) as member, index}
                <li class="card-list-item">
                    <div class="two-lines-text">
                        <span>{member?.name}</span>
                        <span>{formatNumberCompact(member?.power || 0)}</span>
                    </div>

                    {#if !ReactiveSettings.screenShotMode}
                        <IconButton
                            class="material-symbols-rounded"
                            onclick={() => onClick_RemoveMember(member)}
                        >
                            person_remove
                        </IconButton>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .card-compat {
        --card-background: var(--mdc-theme-surface);
        --card-text: var(--mdc-theme-text-primary-on-background);

        position: relative;

        border-radius: var(--mdc-shape-medium, 4px);

        display: flex;
        flex-direction: column;

        background: var(--card-background, hsl(218, 62%, 98%));
        color: var(--card-text, rgba(0, 0, 0, 0.87));

        box-shadow:
            0px 2px 1px -1px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.14),
            0px 1px 3px 0px rgba(0, 0, 0, 0.12);

        user-select: none;
    }

    .card-header {
        padding-left: 16px;
        display: flex;
    }

    .card-header > .two-lines-text {
        padding-top: 16px;
        padding-bottom: 16px;
    }

    .card-header-actions {
        padding-left: 16px;
        padding-right: 8px;
        padding-top: 8px;
        display: flex;
    }

    .two-lines-text {
        padding: 4px 0;

        display: flex;
        flex-direction: column;
        flex-grow: 1;

        font-family: var(
            --mdc-typography-body2-font-family,
            var(--mdc-typography-font-family, Roboto, sans-serif)
        );
    }
    .two-lines-text > span:nth-child(1) {
        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
        font-weight: var(--mdc-typography-subtitle1-font-weight, 400);
        letter-spacing: var(
            --mdc-typography-subtitle1-letter-spacing,
            0.009375em
        );

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .two-lines-text > span:nth-child(2) {
        font-size: var(--mdc-typography-body2-font-size, 0.875rem);
        font-weight: var(--mdc-typography-body2-font-weight, 400);
        letter-spacing: var(
            --mdc-typography-body2-letter-spacing,
            0.0178571429em
        );

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .card-list {
        list-style-type: none;
    }

    .card-list-item {
        padding-left: 16px;

        display: flex;
        flex-direction: row;
        align-items: center;

        border-top: 1px solid var(--card-text, #eee);
    }
</style>
