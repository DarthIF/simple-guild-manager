<script lang="ts">
    import Dialog, {
        Title,
        Content,
        Actions,
        InitialFocus,
    } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import {
        DialogActions,
        type DialogCloseEvent,
        type OnDialogClosedListener,
    } from "./common";
    import { action } from "$lib/strings/strings";

    type ConfirmDialogSettings = {
        title?: string | LocalizedString;
        label?: string | LocalizedString;
        cancelText?: string | LocalizedString;
        acceptText?: string | LocalizedString;
    };

    export function open(
        settings: ConfirmDialogSettings,
        event: OnDialogClosedListener | undefined = undefined,
    ) {
        title = settings.title || "";
        label = settings.label || "";
        onDialogClosed = event;
        visible = true;
    }

    export function close() {
        visible = false;
        title = "";
        label = "";
        onDialogClosed = undefined;
    }

    let visible: boolean = $state(false);
    let title: string | LocalizedString = $state("");
    let label: string | LocalizedString = $state("");
    let cancelText: string | LocalizedString = $state(action.cancel);
    let acceptText: string | LocalizedString = $state(action.ok);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);
</script>

{/* @ts-ignore */ null}
<Dialog
    bind:open={visible}
    onSMUIDialogClosed={onDialogClosed}
    style="user-select: none;"
>
    {#if title !== ""}
        <Title>{getAppropriatedString(title)}</Title>
    {/if}
    <Content>
        {getAppropriatedString(label)}
    </Content>
    <Actions>
        <Button action={DialogActions.CANCEL}>
            <Label>{getAppropriatedString(cancelText)}</Label>
        </Button>
        <Button action={DialogActions.ACCEPT}>
            <Label>{getAppropriatedString(acceptText)}</Label>
        </Button>
    </Actions>
</Dialog>

<style></style>
