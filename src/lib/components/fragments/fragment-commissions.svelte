<script lang="ts">
    import { onMount } from "svelte";
    import HorizontalScrollWarper from "../misc/horizontal-scroll-warper.svelte";
    import Button, { Label } from "@smui/button";
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import {
        CommissionState,
        Database,
        ReactiveData,
        type MemberType,
    } from "$lib/utils/reactive-database.svelte";
    import SmuiCardCommission from "../smui/cards/smui-card-commission.svelte";
    import SmuiDialogCommission from "../smui/dialogs/smui-dialog-commission.svelte";
    import {
        DialogActions,
        type DialogCloseEvent,
    } from "../smui/dialogs/common";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
    import { fragment_commissions } from "$lib/strings/strings";

    function handleCommissionReset() {
        if (
            confirm(
                "Deseja reiniciar o ciclo de comissões? Essa ação irá limpar a lista de quem fechou as comissões, e não pode ser desfeita.",
            )
        ) {
            Database.resetCommissionCycle();
        }
    }

    function handleItemClick(member: MemberType) {
        el_dialogCommission.open(member, handleDialogListener);
    }

    function handleDialogListener(action: DialogActions, member: MemberType) {
        switch (action) {
            case DialogActions.COMMISSION_CLOSE_TODAY:
                Database.setCommissionState(member, CommissionState.CLOSED);
                break;
            case DialogActions.COMMISSION_ALREADY_CLOSED:
                Database.setCommissionState(member, CommissionState.CLOSED, false);
                break;
            case DialogActions.COMMISSION_AVAILABLE:
                Database.setCommissionState(member, CommissionState.AVAILABLE);
                break;
            case DialogActions.COMMISSION_INACTIVE:
                Database.setCommissionState(member, CommissionState.INACTIVE);
                break;
            case DialogActions.COMMISSION_MISSED:
                el_dialogPrompt.setValue(member.commissions.missed);
                el_dialogPrompt.open((e: DialogCloseEvent) => {
                    console.log(e.detail.action);

                    if (e.detail.action === DialogActions.ACCEPT) {
                        const value = el_dialogPrompt.getValue();
                        member.commissions.missed = Number.parseInt(value) || 0;
                    }

                    // Abrir novamente o dialogo
                    el_dialogCommission.open(member, handleDialogListener);
                });
                break;
        }
    }

    onMount(() => {});

    const GRID_SPAN_DEVICES = { desktop: 6, tablet: 4, phone: 4 };

    let availableMembers = $derived.by(Database.listCommissionAvailableMembers);
    let closedMembers = $derived.by(Database.listCommissionClosedMembers);
    let excludedMembers = $derived.by(Database.listCommissionInactiveMembers);

    let el_dialogCommission: SmuiDialogCommission;
    let el_dialogPrompt: SmuiDialogPrompt;
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
        {#if excludedMembers.length > 0}
            <Cell spanDevices={GRID_SPAN_DEVICES}>
                <SmuiCardCommission
                    bind:members={excludedMembers}
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
