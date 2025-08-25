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
    import { getAppropriatedString } from "$lib/strings";
    import { dialog_add_member } from "$lib/strings/strings";
    import {
        Database,
        GameEvents,
        type MemberType,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { formatNumberCompact } from "$lib/utils/number-util";

    export function open(gameEvent: GameEvents, team: TeamType) {
        freeMembers = Database.listFreeMembers(gameEvent).sort((a, b) => {
            return b.power - a.power;
        });

        targetEvent = gameEvent;
        targetTeam = team;

        visible = true;
    }

    export function close() {
        visible = false;
        targetEvent = null;
        targetTeam = null;
        freeMembers = [];
    }

    function addMemberToTeam(member: MemberType) {
        if (!targetEvent || !targetTeam) {
            console.error("Erro ao adicionar o membro a equipe", {
                member,
                targetEvent,
                targetTeam,
            });
            return;
        }

        Database.addMemberToTeamV2(targetEvent, targetTeam.id, member.id);
        close();
    }

    let visible: boolean = $state(false);
    let freeMembers: MemberType[] = $state([]);
    let targetEvent: GameEvents | null = $state(null);
    let targetTeam: TeamType | null = $state(null);

    let {} = $props();
</script>

{/* @ts-ignore */ null}
<Dialog bind:open={visible} style="user-select: none;">
    <Title>
        {getAppropriatedString(dialog_add_member.title, targetTeam?.name)}
    </Title>
    <Content>
        <List twoLine nonInteractive>
            {#if freeMembers.length === 0}
                <Item>
                    <Text>
                        <PrimaryText>
                            {getAppropriatedString(
                                dialog_add_member.no_free_members,
                            )}
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
                                Power: {formatNumberCompact(member.power)}
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
