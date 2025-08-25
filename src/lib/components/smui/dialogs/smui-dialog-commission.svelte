<script lang="ts">
    import {
        CommissionState,
        getCommissionStateString,
        type MemberType,
    } from "$lib/utils/reactive-database.svelte";
    import Dialog, { Content, Title } from "@smui/dialog";
    import List, {
        Graphic,
        Item,
        Separator,
        Subheader,
        Text,
    } from "@smui/list";
    import { DialogActions } from "./common";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { basic, fragment_commissions } from "$lib/strings/strings";

    type CommissionDialogListener = (
        action: DialogActions,
        member: MemberType,
    ) => void;

    export function open(
        member: MemberType,
        listener: CommissionDialogListener,
    ) {
        // Remover o pendentClose
        clearTimeout(pendentClose);

        currentMember = member;
        currentListener = listener;
        visible = true;
    }

    export function close() {
        const clone = JSON.parse(JSON.stringify(currentMember));

        visible = false;
        currentMember = clone;
        currentListener = null;

        pendentClose = setTimeout(() => {
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

    let pendentClose: number | undefined = undefined;

    let visible: boolean = $state(false);
    let currentMember: MemberType | null = $state(null);
    let currentListener: CommissionDialogListener | null = $state(null);
    let currentState: string = $derived.by(() => {
        if (!currentMember) return "";

        const localized = getCommissionStateString(
            currentMember.commissions.state,
        );
        return getAppropriatedString(localized);
    });
    let currentStateTime: string = $derived.by(() => {
        if (!currentMember || currentMember.commissions.time === 0) {
            return "?";
        }

        return new Date(currentMember.commissions.time).toLocaleDateString();
    });
    let currentMissed: string = $derived.by(() => {
        if (!currentMember) return "";

        const missedCount = currentMember.commissions.missed;

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
            State: {currentState}
        </div>
        <div>
            Date: {currentStateTime}
        </div>
        <div>
            Missed: {currentMissed}
        </div>
        <List>
            <Separator />
            {#if currentMember?.commissions.state !== CommissionState.CLOSED}
                <Subheader tag="h6">Comissão</Subheader>
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
                    <Text>Fechar hoje</Text>
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
                    <Text>Marcar como fechado</Text>
                </Item>
                <Separator />
            {/if}

            <Subheader tag="h6">Gerenciar</Subheader>
            <Item
                class="dialog-commission-rounded-item"
                onclick={() => {
                    callDialogListener(DialogActions.COMMISSION_MISSED);
                }}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    pool
                </Graphic>
                <Text>Perdeu a comissão</Text>
            </Item>
            {#if currentMember?.commissions.state !== CommissionState.AVAILABLE}
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
                    <Text>Deixar disponível</Text>
                </Item>
            {/if}
            {#if currentMember?.commissions.state !== CommissionState.INACTIVE}
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
                    <Text>Marcar como inativo</Text>
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
