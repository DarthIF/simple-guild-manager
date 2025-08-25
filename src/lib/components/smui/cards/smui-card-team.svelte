<script lang="ts">
    import { onMount } from "svelte";
    import Card, { Content } from "@smui/card";
    import IconButton from "@smui/icon-button";
    import List, {
        Item,
        Meta,
        PrimaryText,
        SecondaryText,
        Text,
    } from "@smui/list";
    import {
        calculateTeamPowerToDisplay,
        Database,
        type GameEvents,
        type MemberType,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { ReactiveSettings } from "$lib/utils/reactive-settings.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { component_card_team } from "$lib/strings/strings";
    import {
        applyColorVariables,
        getColorListItemForIndex,
    } from "$lib/utils/color-list";
    import { formatNumberCompact } from "$lib/utils/number-util";

    type ExportType = {
        index: number;
        team: TeamType;
        gameEvent: GameEvents;
        onAddMemberClick: (gameEvent: GameEvents, team: TeamType) => void;
        onDeleteTeamClick: (gameEvent: GameEvents, team: TeamType) => void;
    };

    function onClick_RemoveMember(member: MemberType | undefined) {
        if (member)
            Database.removeMemberFromTeamV2(gameEvent, team.id, member.id);
    }

    onMount(() => {
        const element = el_card.getElement();
        const color = getColorListItemForIndex(index);

        applyColorVariables(element, color);
    });

    let el_card: Card;

    let {
        index = 0,
        team,
        gameEvent,
        onAddMemberClick,
        onDeleteTeamClick,
    }: ExportType = $props();
</script>

<Card
    bind:this={el_card}
    padded={false}
    class="smui-team-card"
    style="user-select: none; justify-content: space-between;"
>
    <Content style="padding: 16px 0;">
        <List nonInteractive style="margin-top: -12px; padding: 0;">
            <Item style="padding: 0;">
                <Text style="margin-left: 16px;">
                    <PrimaryText>
                        {team.name}
                    </PrimaryText>
                    <SecondaryText>
                        {getAppropriatedString(component_card_team.total_power)}
                        {calculateTeamPowerToDisplay(team)}
                    </SecondaryText>
                </Text>
                <Meta style="padding-right: 5px;">
                    <!-- Botões para gerenciar o time -->
                    {#if !ReactiveSettings.screenShotMode}
                        <!-- Botão para adicionar um membro -->
                        {#if team.members.length < 4}
                            <IconButton
                                class="material-symbols-rounded"
                                onclick={() => {
                                    onAddMemberClick(gameEvent, team);
                                }}
                            >
                                person_add
                            </IconButton>
                        {/if}

                        <!-- Botão para apagar o time -->
                        <IconButton
                            class="material-symbols-rounded"
                            onclick={() => {
                                onDeleteTeamClick(gameEvent, team);
                            }}
                        >
                            delete
                        </IconButton>
                    {/if}
                </Meta>
            </Item>
        </List>

        <List nonInteractive style="padding-bottom: 0;">
            {#each team.members.map( (id) => Database.findMember(id), ) as member, index}
                <Item class="team-member" style="">
                    <Text style="margin-top: -16px; margin-left: 16px;">
                        <PrimaryText>
                            {member?.name}
                        </PrimaryText>
                        <SecondaryText>
                            {formatNumberCompact(member?.power || 0)}
                        </SecondaryText>
                    </Text>
                    <Meta style="padding-right: 5px;">
                        {#if !ReactiveSettings.screenShotMode}
                            <IconButton
                                class="material-symbols-rounded"
                                onclick={() => onClick_RemoveMember(member)}
                            >
                                person_remove
                            </IconButton>
                        {/if}
                    </Meta>
                </Item>
            {/each}
        </List>
    </Content>
</Card>

<style>
    :global(.team-member) {
        padding: 0 !important;
        border-bottom: 1px solid
            var(--mdc-theme-text-primary-on-background, #eee) !important;
    }
    :global(.team-member:last-child) {
        border-bottom: none !important;
    }
</style>
