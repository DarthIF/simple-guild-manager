<script lang="ts">
    import { onMount } from "svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import CardSettings from "../cards/card-settings.svelte";
    import MaterialButton from "../buttons/material-button.svelte";
    import MemberItem from "../list/member-item.svelte";
    import {
        Database,
        ReactiveData,
        type MemberType,
    } from "$lib/utils/reactive-database.svelte";
    import {
        formatNumberCompact,
        parseCompactNumber,
    } from "$lib/utils/number-util";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { action, fragments } from "$lib/strings/strings";
    import SmuiTextField from "../smui/smui-text-field.svelte";
    import Card, {
        Content,
        PrimaryAction,
        Actions,
        ActionButtons,
        ActionIcons,
    } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import IconButton from "@smui/icon-button";
    import SmuiSettingsCard from "../smui/smui-settings-card.svelte";
    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
        Separator,
    } from "@smui/list";
    import SmuiDialogMember from "../smui/dialogs/smui-dialog-member.svelte";
    import SmuiFab from "../smui/smui-fab.svelte";

    function saveNewOrgName() {
        const value = temp_newName.trim();
        if (value.length < 1) {
            alert("ERROR");
            return;
        }

        Database.setOrganizationName(value);
    }

    function addNewMember() {
        const name = el_dialogMember.getName();
        if (!name) {
            alert("name error");
            return;
        }

        const power = el_dialogMember.getPower();
        const powerNum = parseCompactNumber(power);
        if (isNaN(powerNum)) {
            alert("power error");
            return;
        }

        // Adicionar no banco de dados
        Database.addMember(name, powerNum);
    }

    function dialogMemberCloseHandler(e: CustomEvent<{ action: string }>) {
        const action = e.detail.action;
        const editMode = el_dialogMember.isInEditMode();
        const editMember = el_dialogMember.getEditingMember();

        el_dialogMember.close();

        if (action === "accept" && editMode === false) {
            addNewMember();
            return;
        }

        if (action === "accept" && editMode === true && editMember !== null) {
            const name = el_dialogMember.getName();
            const power = el_dialogMember.getPower();

            Database.editMember(editMember.id, name, power);

            return;
        }

        if (action === "delete" && editMode === true && editMember !== null) {
            Database.deleteMemberV2(editMember);
            return;
        }
    }

    function getTitleOfCard(members: MemberType[]): LocalizedString {
        const base = fragments.title_membersList;
        return {
            en: base.en.replace("%s", members.length.toString()),
            pt: base.pt.replace("%s", members.length.toString()),
        };
    }

    function getPlaceholderImageUrl(member: MemberType) {
        const char = member.name.trim().charAt(0);
        return `url(https://placehold.co/72?font=roboto&text=${char})`;
    }

    onMount(() => {
        el_dialogMember.setOnDialogClosed(dialogMemberCloseHandler);
    });

    let temp_newName = $state(ReactiveData.organization);
    let el_dialogMember: SmuiDialogMember;
</script>

<div class="fragment">
    <SmuiSettingsCard title={fragments.title_changeOrgName}>
        <Content>
            <SmuiTextField
                style="width: 100%;"
                bind:value={temp_newName}
                variant="outlined"
                label={getAppropriatedString(fragments.new_name)}
            />
        </Content>
        <Actions style="display: flex; justify-content: end;">
            <Button
                style="margin-right: 8px;"
                variant="unelevated"
                onclick={saveNewOrgName}
            >
                <Label>{getAppropriatedString(action.save)}</Label>
            </Button>
        </Actions>
    </SmuiSettingsCard>

    <div class="space-item"></div>

    <SmuiSettingsCard title={getTitleOfCard(ReactiveData.members)}>
        <List class="" twoLine avatarList nonInteractive>
            {#each ReactiveData.members as member, index}
                <Item>
                    <Graphic
                        class="fragment-organization-list-item-image"
                        style="--bg: {getPlaceholderImageUrl(member)}"
                    />
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
                                el_dialogMember.open(member);
                            }}
                        >
                            edit
                        </IconButton>
                    </Meta>
                </Item>
                {#if index < ReactiveData.members.length - 1}
                    <Separator style="margin-left: 72px;" />
                {/if}
            {/each}
        </List>
    </SmuiSettingsCard>
</div>
<div class="fragment">
    <CardSettings
        title={`Lista de Membros (${ReactiveData.members.length}/30)`}
    >
        <ul class="list" id="membersList">
            {#if ReactiveData.members.length < 1}
                <MemberItem noMemberMode={true} />
            {:else}
                {#each ReactiveData.members as member, index}
                    <MemberItem
                        memberName={member.name}
                        memberPower={member.power}
                        onClick={() => {
                            Database.deleteMemberV2(member, index);
                        }}
                    />
                {/each}
            {/if}
        </ul>
    </CardSettings>
</div>

<SmuiFab
    icon="add"
    onClick={() => {
        el_dialogMember.open();
    }}
/>
<SmuiDialogMember bind:this={el_dialogMember} />

<style>
    .fragment {
        padding: 16px;
        padding-bottom: 96px;
    }

    :global(.fragment-organization-list-item-image) {
        --bg: "";

        background-image: var(--bg);
        background-size: contain;
        background-position: center;
    }

    .space-item {
        margin-top: 16px;
    }
</style>
