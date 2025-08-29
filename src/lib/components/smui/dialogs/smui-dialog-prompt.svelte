<script lang="ts">
    import Dialog, {
        Title,
        Content,
        Actions,
        InitialFocus,
    } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import type { OnDialogClosedListener } from "./common";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import { action } from "$lib/strings/strings";

    type ExportTypes = {
        title?: string | LocalizedString;
        label?: string | LocalizedString;
        type?: string;
    };

    export function open(event: OnDialogClosedListener) {
        onDialogClosed = event;
        visible = true;
    }

    export function close() {
        visible = false;
        onDialogClosed = undefined;
    }

    export function getValue() {
        return promptValue.toString().trim();
    }

    export function setValue(value: string | number) {
        promptValue = value;
    }

    let visible: boolean = $state(false);
    let promptValue: string | number = $state("");
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);

    let dialog_title: string = $derived.by(() => getAppropriatedString(title));
    let dialog_label: string = $derived.by(() => getAppropriatedString(label));

    let { title = "", label = "", type = "text" }: ExportTypes = $props();
</script>

{/* @ts-ignore */ null}
<Dialog
    bind:open={visible}
    onSMUIDialogClosed={onDialogClosed}
    style="user-select: none;"
>
    {#if dialog_title}
        <Title>{dialog_title}</Title>
    {/if}
    <Content>
        {dialog_label}
        <div class="dialog-content">
            <Textfield
                bind:value={promptValue}
                required
                variant="outlined"
                {type}
            />
        </div>
    </Content>
    <Actions>
        <Button action="cancel">
            <Label>{getAppropriatedString(action.cancel)}</Label>
        </Button>
        <Button action="accept">
            <Label>{getAppropriatedString(action.ok)}</Label>
        </Button>
    </Actions>
</Dialog>

<style>
    .dialog-content {
        min-width: 300px;
        margin: 0 -8px 0 -8px;
        padding-top: 8px;

        display: flex;
        flex-direction: column;
    }

    @media (min-width: 600px) {
        .dialog-content {
            margin: 0;
        }
    }
</style>
