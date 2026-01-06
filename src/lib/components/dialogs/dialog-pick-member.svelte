<script lang="ts">
    import Dialog, { Title, Content } from "@smui/dialog";
    import IconButton from "@smui/icon-button";
    import List, {
        Item,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from "@smui/list";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import type { DatabaseOperations } from "$lib/common/database/database-interfaces";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import { basic } from "$lib/strings/strings";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import type { Nullable } from "$lib/utils/types";
    import { Loading } from "$lib/client/settings.svelte";

    export async function open(
        membersList: () => Promise<MemberTypeV3[]>,
        onClick: OnPickMemberListener,
    ) {
        Loading.start();

        // Carregar os membros de forma assincrônica
        availableMembers = await membersList();

        Loading.finish();

        visible = true;
        onClickListener = onClick;
    }

    export function close() {
        visible = false;

        // Limpar as variáveis
        availableMembers = [];
        onClickListener = null;
    }

    type OnPickMemberListener = (member: MemberTypeV3) => void;

    let visible: boolean = $state(false);
    let availableMembers: MemberTypeV3[] = $state([]);
    let onClickListener: Nullable<OnPickMemberListener> = null;

    type ExportType = {
        title: string | LocalizedString;
        emptyListText: string | LocalizedString;
    };
    let { title, emptyListText }: ExportType = $props();
</script>

<Dialog bind:open={visible} style="user-select: none;">
    <Title>
        {getAppropriatedString(title)}

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
            {#if availableMembers.length === 0}
                <Item>
                    <Text>
                        <PrimaryText>
                            {getAppropriatedString(emptyListText)}
                        </PrimaryText>
                    </Text>
                </Item>
            {:else}
                {#each availableMembers as member}
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
                                    if (onClickListener) {
                                        onClickListener(member);
                                    }

                                    close()
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
