<script lang="ts">
    import { Content, Actions } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import IconButton from "@smui/icon-button";
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
    import SmuiSettingsCard from "../smui/cards/smui-settings-card.svelte";
    import SmuiTextField from "../smui/smui-text-field.svelte";
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
    import { action, fragment_manage } from "$lib/strings/strings";
    import { getPlaceHolderStyle } from "./fragments";
    import { onMount } from "svelte";

    function saveNewOrgName() {
        const value = editorOrgName.trim();
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
        const base = fragment_manage.title_membersList;
        return {
            en: base.en.replace("%s", members.length.toString()),
            pt: base.pt.replace("%s", members.length.toString()),
        };
    }

    onMount(() => {
        el_dialogMember.setOnDialogClosed(dialogMemberCloseHandler);
    });

    const bodyStyle = getComputedStyle(document.body);
    let editorOrgName = $state(ReactiveData.organization);
    let sortedMembers = $derived.by(() => {
        return [...ReactiveData.members].sort((a, b) => b.power - a.power);
    });

    let el_dialogMember: SmuiDialogMember;
</script>

<div class="fragment" id="manageOrg">
    <SmuiSettingsCard title={fragment_manage.title_changeOrgName}>
        <Content>
            <SmuiTextField
                style="width: 100%;"
                bind:value={editorOrgName}
                variant="outlined"
                label={getAppropriatedString(fragment_manage.new_name)}
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
            {#each sortedMembers as member, index}
                <Item>
                    <Graphic
                        class="fragment-organization--list-item-image"
                        style={getPlaceHolderStyle(bodyStyle, member)}
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

<SmuiFab
    icon="add"
    onClick={() => {
        el_dialogMember.open();
    }}
/>
<SmuiDialogMember bind:this={el_dialogMember} />

<style>
    :global(.fragment-organization--list-item-image) {
        --bg: "";

        background-image: var(--bg);
        background-size: contain;
        background-position: center;
    }

    .space-item {
        margin-top: 16px;
    }

    /* Default styles for larger screens (e.g., desktops) */
    .fragment {
        width: 600px;
        margin: auto;
        padding: 16px;
        padding-bottom: 96px;
    }

    /* Styles for tablets */
    @media screen and (max-width: 1023px) {
        .fragment {
            width: 520px;
        }
    }

    /* Styles for smartphones */
    @media screen and (max-width: 767px) {
        .fragment {
            width: auto;
        }
    }
</style>
