<script lang="ts">
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import SmuiDialogCommission from "../smui/dialogs/smui-dialog-commission.svelte";
    import {
        DialogActions,
        type DialogCloseEvent,
    } from "../smui/dialogs/common";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
    import SmuiFab from "../smui/smui-fab.svelte";
    import CommissionSelector from "../selector/commission-selector.svelte";
    import CardCommissionMember from "../card-commission-member.svelte";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import type {
        DatabaseOperationResult_SetCommissionState,
        DatabaseOperations,
    } from "$lib/common/database/database-interfaces";
    import { CommissionState } from "$lib/common/database/enums";
    import { fragment_commissions } from "$lib/strings/strings";
    import { confirmWith } from "$lib/strings";
    import { Loading } from "$lib/client/settings.svelte";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";

    function CommonOperationListener(
        result: DatabaseOperationResult_SetCommissionState,
    ) {
        Loading.finish(!result.updated);
    }

    function handleCommissionReset() {
        if (!confirmWith(fragment_commissions.confirm_reset_cycle)) {
            return;
        }

        Loading.start();
        database.resetCommissionCycle().then((result) => {
            Loading.finish(!result);
        });
    }

    function handleItemClick(member: MemberTypeV3) {
        el_dialogCommission.open(member, handleDialogListener);
    }

    function handleDialogListener(action: DialogActions, member: MemberTypeV3) {
        // Ativar o modo de carregamento
        Loading.start();

        switch (action) {
            case DialogActions.COMMISSION_CLOSE_TODAY:
                return database
                    .setCommissionState(member.id, CommissionState.CLOSED, true)
                    .then(CommonOperationListener);

            case DialogActions.COMMISSION_ALREADY_CLOSED:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.CLOSED,
                        false,
                    )
                    .then(CommonOperationListener);

            case DialogActions.COMMISSION_AVAILABLE:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.AVAILABLE,
                        true,
                    )
                    .then(CommonOperationListener);

            case DialogActions.COMMISSION_INACTIVE:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.INACTIVE,
                        true,
                    )
                    .then(CommonOperationListener);

            case DialogActions.COMMISSION_MISSED:
                alert("Function not implemented on the server!");

                el_dialogPrompt.setValue(member.missed);
                el_dialogPrompt.open((e: DialogCloseEvent) => {
                    console.log(e.detail.action);

                    if (e.detail.action === DialogActions.ACCEPT) {
                        const value = el_dialogPrompt.getValue();
                        member.missed = Number.parseInt(value) || 0;
                    }

                    // Abrir novamente o dialogo
                    el_dialogCommission.open(member, handleDialogListener);
                });
                break;
        }
    }

    function reactiveListMembers(state: CommissionState): MemberTypeV3[] {
        return [...ReactiveDB.members]
            .filter((m) => m.state === state)
            .sort((a, b) => b.power - a.power);
    }
    function listAvailable() {
        return reactiveListMembers(CommissionState.AVAILABLE);
    }
    function listClosed() {
        return reactiveListMembers(CommissionState.CLOSED);
    }
    function listInactive() {
        return reactiveListMembers(CommissionState.INACTIVE);
    }

    const GRID_SIZES = { desktop: 4, tablet: 4, phone: 4 };

    let selectedTab = $state(CommissionState.AVAILABLE);
    let availableMembers = $derived.by(listAvailable);
    let closedMembers = $derived.by(listClosed);
    let inactiveMembers = $derived.by(listInactive);
    let targetDisplayMembers = $derived.by(() => {
        switch (selectedTab) {
            case CommissionState.AVAILABLE:
                return availableMembers;
            case CommissionState.CLOSED:
                return closedMembers;
            case CommissionState.INACTIVE:
                return inactiveMembers;
            default:
                return [];
        }
    });

    let el_dialogCommission: SmuiDialogCommission;
    let el_dialogPrompt: SmuiDialogPrompt;

    type ExportType = { database: DatabaseOperations };
    let { database = $bindable() }: ExportType = $props();
</script>

<div class="fragment">
    <CommissionSelector bind:selected={selectedTab} />

    <LayoutGrid>
        {#each targetDisplayMembers as member}
            <Cell spanDevices={GRID_SIZES}>
                <CardCommissionMember
                    {member}
                    onClickListener={handleItemClick}
                />
            </Cell>
        {/each}
    </LayoutGrid>
</div>

<SmuiFab icon="sync" onClick={handleCommissionReset} />

<SmuiDialogCommission bind:this={el_dialogCommission} />
<SmuiDialogPrompt
    bind:this={el_dialogPrompt}
    type="number"
    title={fragment_commissions.dialog_prompt_missed}
/>

<style>
    .fragment {
        user-select: none;
    }
</style>
