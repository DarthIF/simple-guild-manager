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
    import { parseCompactNumber } from "$lib/utils/number-util";
    import SmuiTextField from "../smui/smui-text-field.svelte";
    import Card, {
        Content,
        PrimaryAction,
        Actions,
        ActionButtons,
        ActionIcons,
    } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { action, fragments } from "$lib/strings/strings";
    import SmuiSettingsCard from "../smui/smui-settings-card.svelte";

    function saveNewName() {
        const value = temp_newName.trim();
        if (value.length < 1) {
            alert("ERROR");
            return;
        }

        Database.setOrganizationName(value);
    }

    function addNewMember() {
        const name = el_inputMemberName.value.trim();
        if (!name) {
            alert("name error");
            return;
        }

        const power = el_inputMemberPower.value.trim() || "0";
        const powerNum = parseCompactNumber(power);
        if (isNaN(powerNum)) {
            alert("power error");
            return;
        }

        // Adicionar no banco de dados
        Database.addMember(name, powerNum);

        // Limpar a UI
        el_inputMemberName.value = "";
        el_inputMemberPower.value = "0";
    }

    function getTitleOfCard(members: MemberType[]): LocalizedString {
        const base = fragments.title_membersList;
        return {
            en: base.en.replace("%s", members.length.toString()),
            pt: base.pt.replace("%s", members.length.toString()),
        };
    }

    onMount(() => {});

    let temp_newName = $state(ReactiveData.organization);

    let el_inputNewOrgName: HTMLInputElement;
    let el_inputMemberName: HTMLInputElement;
    let el_inputMemberPower: HTMLInputElement;
</script>

<div class="fragment">
    <CardSettings title="Gerenciar Membros">
        <div class="form-group">
            <label class="form-label" for="memberName">Nome do Membro</label>
            <input
                type="text"
                class="form-input"
                id="memberName"
                bind:this={el_inputMemberName}
            />
        </div>
        <div class="form-group">
            <label class="form-label" for="memberPower">Poder</label>
            <input
                type="text"
                class="form-input"
                id="memberPower"
                min="1"
                value="0"
                bind:this={el_inputMemberPower}
            />
        </div>
        <div class="form-actions">
            <MaterialButton type={ButtonTypes.PRIMARY} onClick={addNewMember}>
                Adicionar Membro
            </MaterialButton>
        </div>
    </CardSettings>

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
                            Database.deleteMember(index);
                        }}
                    />
                {/each}
            {/if}
        </ul>
    </CardSettings>
</div>

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
                onclick={saveNewName}
            >
                <Label>{getAppropriatedString(action.save)}</Label>
            </Button>
        </Actions>
    </SmuiSettingsCard>

    <SmuiSettingsCard title={fragments.title_manageMembers}></SmuiSettingsCard>

    <SmuiSettingsCard title={getTitleOfCard(ReactiveData.members)}
    ></SmuiSettingsCard>
</div>

<style>
    .fragment {
        padding: 16px;
    }

    .form-group {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
    }

    .form-label {
        margin-bottom: 8px;
        display: block;
        font-weight: 500;
    }

    .form-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .form-actions {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }

    .form-group span {
        font-size: small;
    }
</style>
