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
    import type {
        EventTeamType,
        MemberTypeV3,
    } from "$lib/common/database/constants-and-types";
    import type { DatabaseOperations } from "$lib/common/database/database-interfaces";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import { GameEvents } from "$lib/common/database/enums";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";
    import { Loading } from "$lib/client/settings.svelte";

    export async function open(gameEvent: GameEvents, team: EventTeamType) {
        Loading.start();

        const list = await database.listFreeMembersForEvent(gameEvent);
        freeMembers = list.sort((a, b) => {
            return b.power - a.power;
        });

        targetEvent = gameEvent;
        targetTeam = team;

        Loading.finish();

        visible = true;
    }

    export function close() {
        visible = false;

        // Limpar as variáveis
        freeMembers = [];
        targetEvent = null;
        targetTeam = null;
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

        Loading.start();
        database
            .addMemberToTeam(targetEvent, targetTeam.id, member.id)
            .then((success) => Loading.finish(!success))
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

        <IconButton
            class="material-symbols-rounded"
            style="opacity: 0; pointer-events: none;"
            action="close"
        >
            close
        </IconButton>
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
