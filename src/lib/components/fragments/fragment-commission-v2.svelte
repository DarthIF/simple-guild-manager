<script lang="ts">
    import Select, { Option } from "@smui/select";
    import LinearProgress from "@smui/linear-progress";
    import SmuiFab from "../smui/smui-fab.svelte";
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import SmuiDialogCommission from "../smui/dialogs/smui-dialog-commission.svelte";
    import {
        DialogActions,
        type DialogCloseEvent,
    } from "../smui/dialogs/common";
    import SmuiDialogPrompt from "../smui/dialogs/smui-dialog-prompt.svelte";
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
    import CommissionMemberSelector from "../misc/commission-member-selector.svelte";
    import Button, { Label } from "@smui/button";
    import type { Nullable } from "$lib/utils/types";

    function onClick__FAB() {}

    // ------------------------------------------

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

    let selectedTab = $state<CommissionState>(CommissionState.AVAILABLE);
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

    let cod_15m: Nullable<MemberTypeV3> = $state(null);
    let cod_40m: Nullable<MemberTypeV3> = $state(null);
    let cod_120m: Nullable<MemberTypeV3> = $state(null);
    let cod_300m: Nullable<MemberTypeV3> = $state(null);
    let cod_5b: Nullable<MemberTypeV3> = $state(null);
    let cod_9b: Nullable<MemberTypeV3> = $state(null);
    let cod_15b: Nullable<MemberTypeV3> = $state(null);

    let progress = $state(1 / 3);
</script>

<div class="fragment"></div>
<div class="commissions-of-day">
    <div class="cod-content">
        <div class="cod-step-1">
            <CommissionMemberSelector
                label="Commission 15M"
                bind:value={cod_15m}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 40M"
                bind:value={cod_40m}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 120M"
                bind:value={cod_120m}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 300M"
                bind:value={cod_300m}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 5.25B"
                bind:value={cod_5b}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 9B"
                bind:value={cod_9b}
                bind:members={availableMembers}
            />
            <CommissionMemberSelector
                label="Commission 15B"
                bind:value={cod_15b}
                bind:members={availableMembers}
            />
        </div>
        <div class="cod-step-2">
            <p>
                Os seguintes membros serão adicionados a lista de
                <b> membros fechados </b>. Por favor confirme se a lista está
                correta.
            </p>
            <ol>
                {#snippet list_item(
                    member: Nullable<MemberTypeV3>,
                    commission: string,
                )}
                    {#if member}
                        <li>{commission}: {member.name}</li>
                    {/if}
                {/snippet}

                {@render list_item(cod_15m, "15M")}
                {@render list_item(cod_40m, "40M")}
                {@render list_item(cod_120m, "120M")}
                {@render list_item(cod_300m, "300M")}
                {@render list_item(cod_5b, "5.25B")}
                {@render list_item(cod_9b, "9B")}
                {@render list_item(cod_15b, "15B")}
            </ol>
        </div>
        <div class="cod-step-3"></div>
    </div>

    <div class="cod-bottom">
        <div class="cod-bottom-progress">
            <LinearProgress {progress} />
        </div>
        <div class="cod-bottom-next">
            <Button onclick={() => {}}>
                <Label>Next</Label>
            </Button>
        </div>
    </div>
</div>

<SmuiFab icon="app_registration" onClick={onClick__FAB} />

<style>
    .fragment {
        user-select: none;
    }

    .commissions-of-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .cod-content {
        height: auto;
        padding-top: 24px;
        padding-bottom: 56px;
    }

    .cod-bottom {
        z-index: 99999;
        height: 56px;
        width: 100%;
        position: fixed;
        bottom: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: aquamarine;
    }
    .cod-bottom-progress {
        width: 240px;

        display: flex;
        flex-direction: row;
    }
    .cod-bottom-next {
        position: absolute;
        right: 0;
    }
</style>
