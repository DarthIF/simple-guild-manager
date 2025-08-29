<script lang="ts">
    import Card, { Content } from "@smui/card";
    import { Label, Icon } from "@smui/common";
    import IconButton from "@smui/icon-button";
    import List, {
        Item,
        PrimaryText,
        SecondaryText,
        Text,
        Meta,
        Separator,
    } from "@smui/list";
    import {
        ReactiveData,
        type MemberType,
    } from "$lib/utils/reactive-database.svelte";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";

    type ExportType = {
        title?: string | LocalizedString;
        icon?: string;
        members: MemberType[];
        onClickListener?: (member: MemberType) => void;
    };

    function handleClick(member: MemberType) {
        onClickListener?.(member);
    }

    let {
        title = "",
        icon = "",
        members = $bindable([]),
        onClickListener = undefined,
    }: ExportType = $props();
</script>

<Card>
    <Content style="padding: 0; user-select: none;">
        <div class="card-title">
            <Icon class="material-symbols-rounded">{icon}</Icon>
            <h6>{getAppropriatedString(title)}</h6>
        </div>
        <List twoLine>
            {#each members as member, index}
                <Item
                    style="padding-right: 8px;"
                    onclick={() => handleClick(member)}
                >
                    <Text>
                        <PrimaryText>
                            {member.name}
                        </PrimaryText>
                        <SecondaryText>
                            Missed: {member.commissions.missed}
                        </SecondaryText>
                    </Text>
                    <Meta>
                        <IconButton
                            class="material-symbols-rounded"
                            onclick={() => handleClick(member)}
                        >
                            edit
                        </IconButton>
                    </Meta>
                </Item>
                {#if index < members.length - 1}
                    <Separator />
                {/if}
            {/each}
        </List>
    </Content>
</Card>

<style>
    .card-title {
        padding-top: 16px;
        padding-left: 16px;
        padding-bottom: 8px;

        display: flex;
        align-items: center;
    }

    .card-title > h6 {
        margin-left: 8px;
    }
</style>
