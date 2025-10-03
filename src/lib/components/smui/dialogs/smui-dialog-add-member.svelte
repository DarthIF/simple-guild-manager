<script lang="ts">
    import Dialog, { Title, Content } from "@smui/dialog";
    import List, {
        Item,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from "@smui/list";
    import IconButton from "@smui/icon-button";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import { GameEvents } from "$lib/common/database/enums";
    import type {
        EventTeamType,
        MemberTypeV3,
    } from "$lib/common/database/constants-and-types";
    import type { DatabaseOperations } from "$lib/common/database/database-interfaces";
    import { basic } from "$lib/strings/strings";
    import {
        ReactiveSettings,
        THEN_CALLBACK_COMPLETE_LOAD,
    } from "$lib/client/settings.svelte";

    export async function open(gameEvent: GameEvents, team: EventTeamType) {
        ReactiveSettings.loading = true;

        const list = await database.listFreeMembersForEvent(gameEvent);
        freeMembers = list.sort((a, b) => {
            return b.power - a.power;
        });

        targetEvent = gameEvent;
        targetTeam = team;

        ReactiveSettings.loading = false;
        visible = true;
    }

    export function close() {
        visible = false;

        // Limpar as variáveis
        targetEvent = null;
        targetTeam = null;
        freeMembers = [];
    }

    function addMemberToTeam(member: MemberTypeV3) {
        if (!targetEvent || !targetTeam) {
            console.error("Erro ao adicionar o membro a equipe", {
                member,
                targetEvent,
                targetTeam,
            });
            return;
        }

        ReactiveSettings.loading = true;
        database
            .addMemberToTeam(targetEvent, targetTeam.id, member.id)
            .then(THEN_CALLBACK_COMPLETE_LOAD)
            .finally(close);
    }

    let visible: boolean = $state(false);
    let freeMembers: MemberTypeV3[] = $state([]);
    let targetEvent: GameEvents | null = $state(null);
    let targetTeam: EventTeamType | null = $state(null);

    type ExportType = {
        database: DatabaseOperations;
        strings: {
            title: string | LocalizedString;
            empty: string | LocalizedString;
        };
    };
    let { database = $bindable(), strings }: ExportType = $props();
</script>

{/* @ts-ignore */ null}
<Dialog bind:open={visible} style="user-select: none;">
    <Title>
        {getAppropriatedString(strings.title, targetTeam?.name)}
    </Title>
    <Content>
        <List twoLine nonInteractive>
            {#if freeMembers.length === 0}
                <Item>
                    <Text>
                        <PrimaryText>
                            {getAppropriatedString(strings.empty)}
                        </PrimaryText>
                    </Text>
                </Item>
            {:else}
                {#each freeMembers as member}
                    <Item>
                        <Text>
                            <PrimaryText>
                                {member.name}
                            </PrimaryText>
                            <SecondaryText>
                                {getAppropriatedString(
                                    basic.power,
                                    formatNumberCompact(member.power),
                                )}
                            </SecondaryText>
                        </Text>
                        <Meta>
                            <IconButton
                                class="material-symbols-rounded"
                                onclick={() => {
                                    addMemberToTeam(member);
                                }}
                            >
                                add
                            </IconButton>
                        </Meta>
                    </Item>
                {/each}
            {/if}
        </List>
    </Content>
</Dialog>

<style></style>
