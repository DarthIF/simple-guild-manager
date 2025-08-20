<script lang="ts">
    import Dialog, {
        Title,
        Content,
        Actions,
        InitialFocus,
    } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";
    import type { OnDialogClosedListener } from "./common";

    type ExportTypes = {
        title?: string | LocalizedString;
        label?: string | LocalizedString;
    };

    let visible: boolean = $state(false);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);

    let dialog_title: string = $derived.by(() => getAppropriatedString(title));
    let dialog_label: string = $derived.by(() => getAppropriatedString(label));

    let { title = "", label = "" }: ExportTypes = $props();
</script>

{/* @ts-ignore */ null}
<Dialog
    bind:open={visible}
    onSMUIDialogClosed={onDialogClosed}
    style="user-select: none;"
>
    <Title>{dialog_title}</Title>
    <Content>
        {dialog_label}
    </Content>
    <Actions>
        <Button action="cancel">
            <Label>Cancel</Label>
        </Button>
        <Button action="accept">
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>

<style></style>
