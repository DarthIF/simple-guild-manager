<script lang="ts">
    import IconButton from "@smui/icon-button";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import Menu from "@smui/menu";
    import { Anchor } from "@smui/menu-surface";
    import { getAppropriatedString } from "$lib/strings";
    import { getColorListItemForIndex } from "$lib/utils/color-list";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import type { DatabaseOperations } from "$lib/common/database/database-interfaces";
    import type {
        EventTeamType,
        MemberTypeV3,
    } from "$lib/common/database/constants-and-types";
    import {
        ReactiveSettings,
        THEN_CALLBACK_COMPLETE_LOAD,
    } from "$lib/client/settings.svelte";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";
    import { GameEvents } from "$lib/common/database/enums";
    import { calculateTeamPowerCompact } from "$lib/client/utils";
    import {
        getMembersOfTeam,
        isMemberLeaderOf,
    } from "$lib/common/database/utils";
    import { fragment_teams } from "$lib/strings/strings";
    import type { CardTeamCallback } from "./card-teamV2-types";
    import type { Undefinable } from "$lib/utils/types";

    // MENU POPUP -------------------------------

    export async function openMenu() {
        if (menu?.isOpen()) return;
        menu?.setOpen(true);
    }

    let menu: Undefinable<Menu> = $state();
    let anchor: Undefinable<HTMLDivElement> = $state();
    let anchorClasses: { [k: string]: boolean } = $state({});

    // ------------------------------------------

    function doCallback(callback?: CardTeamCallback) {
        if (callback && gameEvent) {
            callback(gameEvent, team);
        }
    }

    function onClick_RemoveMember(member: MemberTypeV3 | undefined) {
        if (!member) return;

        ReactiveSettings.loading = true;
        database
            .removeMemberFromTeam(gameEvent, team.id, member.id)
            .then(THEN_CALLBACK_COMPLETE_LOAD);
    }

    let el_card: HTMLDivElement | undefined = $state(undefined);
    $effect(() => {
        if (!el_card) return;

        const color = getColorListItemForIndex(index);

        el_card.style.setProperty("--card-background", color.surface);
        el_card.style.setProperty("--card-text", color.text_primary);
    });

    type ExportType = {
        index?: number;
        team: EventTeamType;
        gameEvent: GameEvents;
        database: DatabaseOperations;
        onAddMemberClick?: CardTeamCallback;
        onSetLeaderClick?: CardTeamCallback;
        onEditTeamNameClick?: CardTeamCallback;
        onDeleteTeamClick?: CardTeamCallback;
    };
    let {
        index = 0,
        team,
        gameEvent,
        database,
        onAddMemberClick = undefined,
        onSetLeaderClick = undefined,
        onEditTeamNameClick = undefined,
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
                    {getAppropriatedString(fragment_teams.total_power)}
                    {calculateTeamPowerCompact(team)}
                </span>
            </div>

            <!-- Ações -->
            <div class="card-header-actions">
                {#if false}
                    <!-- Botões para gerenciar o time -->
                    {#if !ReactiveSettings.screenShotMode}
                        <!-- Botão para adicionar um membro -->
                        {#if team.count < team.size}
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
                {/if}

                <!-- Ancora do menu popup -->
                {#if !ReactiveSettings.screenShotMode}
                    <div
                        class={Object.keys(anchorClasses).join(" ")}
                        use:Anchor={{
                            addClass: (className) => {
                                if (!anchorClasses[className]) {
                                    anchorClasses[className] = true;
                                }
                            },
                            removeClass: (className) => {
                                if (anchorClasses[className]) {
                                    delete anchorClasses[className];
                                }
                            },
                        }}
                        bind:this={anchor}
                    >
                        <!-- Botão para abrir o menu -->
                        <IconButton
                            class="material-symbols-rounded"
                            aria-label=""
                            onclick={openMenu}
                        >
                            more_vert
                        </IconButton>

                        <!-- Menu para gerenciar a equipe -->
                        <Menu
                            bind:this={menu}
                            anchor={false}
                            anchorElement={anchor}
                            anchorCorner="BOTTOM_LEFT"
                            anchorMargin={{
                                top: 0,
                                bottom: -16,
                                left: 0,
                                right: 0,
                            }}
                        >
                            <List>
                                <Item
                                    onclick={() => doCallback(onAddMemberClick)}
                                >
                                    <Graphic class="material-symbols-rounded">
                                        person_add
                                    </Graphic>
                                    <Text>Adicionar</Text>
                                </Item>
                                <Item
                                    onclick={() => doCallback(onSetLeaderClick)}
                                >
                                    <Graphic class="material-symbols-rounded">
                                        star
                                    </Graphic>
                                    <Text>Líder</Text>
                                </Item>
                                <Item
                                    onclick={() =>
                                        doCallback(onEditTeamNameClick)}
                                >
                                    <Graphic class="material-symbols-rounded">
                                        edit
                                    </Graphic>
                                    <Text>Renomear</Text>
                                </Item>
                                <Separator />
                                <Item
                                    onclick={() =>
                                        doCallback(onDeleteTeamClick)}
                                >
                                    <Graphic class="material-symbols-rounded">
                                        delete
                                    </Graphic>
                                    <Text>Apagar equipe</Text>
                                </Item>
                            </List>
                        </Menu>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Lista -->
        <ul class="card-list">
            {#each getMembersOfTeam(ReactiveDB, gameEvent, team.id) as member, index}
                <li class="card-list-item">
                    <div class="two-lines-text">
                        <span>{member?.name}</span>
                        <span>{formatNumberCompact(member?.power || 0)}</span>
                    </div>

                    {#if ReactiveSettings.screenShotMode}
                        {#if isMemberLeaderOf(member, team)}
                            <IconButton class="material-symbols-rounded">
                                star
                            </IconButton>
                        {/if}
                    {:else}
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
