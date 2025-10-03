<script lang="ts">
    import Dialog, { Content, Title } from "@smui/dialog";
    import List, {
        Graphic,
        Item,
        Separator,
        Subheader,
        Text,
    } from "@smui/list";
    import { DialogActions } from "./common";
    import { getAppropriatedString } from "$lib/strings";
    import { basic, fragment_commissions } from "$lib/strings/strings";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import { CommissionState } from "$lib/common/database/enums";
    import { getCommissionStateString } from "$lib/client/utils";

    type CommissionDialogListener = (
        action: DialogActions,
        member: MemberTypeV3,
    ) => void;

    export function open(
        member: MemberTypeV3,
        listener: CommissionDialogListener,
    ) {
        // Remover o PENDENT_CLOSE
        clearTimeout(PENDENT_CLOSE);

        currentMember = member;
        currentListener = listener;
        visible = true;
    }

    export function close() {
        const clone = JSON.parse(JSON.stringify(currentMember));

        visible = false;
        currentMember = clone;
        currentListener = null;

        PENDENT_CLOSE = setTimeout(() => {
            currentMember = null;
        }, 250);
    }

    function callDialogListener(forAction: DialogActions) {
        // Adicionar variáveis temporárias para a referencia,
        // pois o método close() substitui elas
        const tempListener = currentListener;
        const tempMember = currentMember;

        // Fechar o dialogo
        close();

        // Chamar o ouvinte
        if (tempListener && tempMember) {
            tempListener(forAction, tempMember);
        }
    }

    let PENDENT_CLOSE: any = undefined;

    let visible: boolean = $state(false);
    let currentMember: MemberTypeV3 | null = $state(null);
    let currentListener: CommissionDialogListener | null = $state(null);
    let currentState: string = $derived.by(() => {
        if (!currentMember) return "";

        const localized = getCommissionStateString(currentMember.state);
        return getAppropriatedString(localized);
    });
    let currentStateTime: string = $derived.by(() => {
        if (!currentMember || currentMember.time === 0) {
            return "?";
        }

        return new Date(currentMember.time).toLocaleDateString();
    });
    let currentMissed: string = $derived.by(() => {
        if (!currentMember) return "";

        const missedCount = currentMember.missed;

        if (missedCount === 0) {
            return getAppropriatedString(basic.no);
        }

        if (missedCount === 1) {
            return getAppropriatedString(
                fragment_commissions.missed_single,
                missedCount,
            );
        }

        return getAppropriatedString(
            fragment_commissions.missed_plural,
            missedCount,
        );
    });
</script>

{/* @ts-ignore */ null}
<Dialog bind:open={visible} style="user-select: none;">
    <Title>{currentMember?.name}</Title>

    <Content>
        <div>
            {getAppropriatedString(fragment_commissions.state, currentState)}
        </div>
        <div>
            {getAppropriatedString(fragment_commissions.date, currentStateTime)}
        </div>
        <div>
            {getAppropriatedString(fragment_commissions.missed, currentMissed)}
        </div>
        <List>
            <Separator />
            {#if currentMember?.state !== CommissionState.CLOSED}
                <Subheader tag="h6"
                    >{getAppropriatedString(basic.manage)}</Subheader
                >
                <Item
                    class="dialog-commission-rounded-item"
                    onclick={() => {
                        callDialogListener(
                            DialogActions.COMMISSION_CLOSE_TODAY,
                        );
                    }}
                >
                    <Graphic
                        class="material-symbols-rounded"
                        aria-hidden="true"
                    >
                        approval_delegation
                    </Graphic>
                    <Text>
                        {getAppropriatedString(
                            fragment_commissions.close_today,
                        )}
                    </Text>
                </Item>
                <Item
                    class="dialog-commission-rounded-item"
                    onclick={() => {
                        callDialogListener(
                            DialogActions.COMMISSION_ALREADY_CLOSED,
                        );
                    }}
                >
                    <Graphic
                        class="material-symbols-rounded"
                        aria-hidden="true"
                    >
                        event_note
                    </Graphic>
                    <Text>
                        {getAppropriatedString(
                            fragment_commissions.mark_closed,
                        )}
                    </Text>
                </Item>
                <Separator />
            {/if}

            <Subheader tag="h6">
                {getAppropriatedString(basic.manage)}
            </Subheader>
            <Item
                class="dialog-commission-rounded-item"
                onclick={() => {
                    callDialogListener(DialogActions.COMMISSION_MISSED);
                }}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    pool
                </Graphic>
                <Text>
                    {getAppropriatedString(
                        fragment_commissions.lost_commission,
                    )}
                </Text>
            </Item>
            {#if currentMember?.state !== CommissionState.AVAILABLE}
                <Item
                    class="dialog-commission-rounded-item"
                    onclick={() => {
                        callDialogListener(DialogActions.COMMISSION_AVAILABLE);
                    }}
                >
                    <Graphic
                        class="material-symbols-rounded"
                        aria-hidden="true"
                    >
                        concierge
                    </Graphic>
                    <Text>
                        {getAppropriatedString(
                            fragment_commissions.mark_available,
                        )}
                    </Text>
                </Item>
            {/if}
            {#if currentMember?.state !== CommissionState.INACTIVE}
                <Item
                    class="dialog-commission-rounded-item"
                    onclick={() => {
                        callDialogListener(DialogActions.COMMISSION_INACTIVE);
                    }}
                >
                    <Graphic
                        class="material-symbols-rounded"
                        aria-hidden="true"
                    >
                        person_off
                    </Graphic>
                    <Text>
                        {getAppropriatedString(
                            fragment_commissions.mark_inactive,
                        )}
                    </Text>
                </Item>
            {/if}
        </List>
    </Content>
</Dialog>

<style>
    :global(.dialog-commission-rounded-item) {
        border-radius: 24px;
    }

    .buttons-group {
        display: flex;
        flex-direction: column;
    }
    .buttons-group ~ .buttons-group {
        border-top: rgba(0, 0, 0, 0.12) 1px solid;
    }
</style>
