<script lang="ts">
    import { onMount } from "svelte";
    import HorizontalScrollWarper from "../misc/horizontal-scroll-warper.svelte";
    import Button, { Label } from "@smui/button";
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import SmuiCardCommission from "../smui/cards/smui-card-commission.svelte";
    import SmuiDialogCommission from "../smui/dialogs/smui-dialog-commission.svelte";
    import {
        DialogActions,
        type DialogCloseEvent,
    } from "../smui/dialogs/common";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
    import { fragment_commissions } from "$lib/strings/strings";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import type { DatabaseOperations } from "$lib/common/database/database-interfaces";
    import { CommissionState } from "$lib/common/database/enums";
    import { confirmWith } from "$lib/strings";
    import {
        ReactiveSettings,
        THEN_CALLBACK_COMPLETE_LOAD,
    } from "$lib/client/settings.svelte";

    function handleCommissionReset() {
        if (!confirmWith(fragment_commissions.confirm_reset_cycle)) return;

        ReactiveSettings.loading = true;
        database.resetCommissionCycle().then(THEN_CALLBACK_COMPLETE_LOAD);
    }

    function handleItemClick(member: MemberTypeV3) {
        el_dialogCommission.open(member, handleDialogListener);
    }

    function handleDialogListener(action: DialogActions, member: MemberTypeV3) {
        // Ativar o modo de carregamento
        ReactiveSettings.loading = true;

        switch (action) {
            case DialogActions.COMMISSION_CLOSE_TODAY:
                return database
                    .setCommissionState(member.id, CommissionState.CLOSED, true)
                    .then(THEN_CALLBACK_COMPLETE_LOAD);

            case DialogActions.COMMISSION_ALREADY_CLOSED:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.CLOSED,
                        false,
                    )
                    .then(THEN_CALLBACK_COMPLETE_LOAD);

            case DialogActions.COMMISSION_AVAILABLE:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.AVAILABLE,
                        true,
                    )
                    .then(THEN_CALLBACK_COMPLETE_LOAD);

            case DialogActions.COMMISSION_INACTIVE:
                return database
                    .setCommissionState(
                        member.id,
                        CommissionState.INACTIVE,
                        true,
                    )
                    .then(THEN_CALLBACK_COMPLETE_LOAD);

            case DialogActions.COMMISSION_MISSED:
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

    onMount(async () => {
        availableMembers = await database.listCommissionMembers(
            CommissionState.AVAILABLE,
        );

        closedMembers = await database.listCommissionMembers(
            CommissionState.CLOSED,
        );

        inactiveMembers = await database.listCommissionMembers(
            CommissionState.INACTIVE,
        );
    });

    const GRID_SPAN_DEVICES = { desktop: 6, tablet: 4, phone: 4 };

    let availableMembers: MemberTypeV3[] = $state([]);
    let closedMembers: MemberTypeV3[] = $state([]);
    let inactiveMembers: MemberTypeV3[] = $state([]);

    let el_dialogCommission: SmuiDialogCommission;
    let el_dialogPrompt: SmuiDialogPrompt;

    type ExportType = { database: DatabaseOperations };
    let { database = $bindable() }: ExportType = $props();
</script>

<div class="fragment" id="manageCommissions">
    <HorizontalScrollWarper class="fragment-commissions-scroll-warper">
        <Button variant="outlined" onclick={handleCommissionReset}>
            <Label>Reiniciar Ciclo</Label>
        </Button>
    </HorizontalScrollWarper>

    <LayoutGrid>
        <Cell spanDevices={GRID_SPAN_DEVICES}>
            <SmuiCardCommission
                bind:members={availableMembers}
                title="Disponível"
                icon="approval_delegation"
                onClickListener={handleItemClick}
            />
        </Cell>
        {#if closedMembers.length > 0}
            <Cell spanDevices={GRID_SPAN_DEVICES}>
                <SmuiCardCommission
                    bind:members={closedMembers}
                    title="Fechado"
                    icon="event_note"
                    onClickListener={handleItemClick}
                />
            </Cell>
        {/if}
        {#if inactiveMembers.length > 0}
            <Cell spanDevices={GRID_SPAN_DEVICES}>
                <SmuiCardCommission
                    bind:members={inactiveMembers}
                    title="Inativos"
                    icon="person_off"
                    onClickListener={handleItemClick}
                />
            </Cell>
        {/if}
    </LayoutGrid>
</div>

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

    @media (max-width: 599px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-phone, 16px);
            padding-left: var(--mdc-layout-grid-margin-phone, 16px);
        }
    }

    @media (min-width: 600px) and (max-width: 839px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-tablet, 16px);
            padding-left: var(--mdc-layout-grid-margin-tablet, 16px);
        }
    }

    @media (min-width: 840px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-desktop, 24px);
            padding-left: var(--mdc-layout-grid-margin-desktop, 24px);
        }
    }
</style>
