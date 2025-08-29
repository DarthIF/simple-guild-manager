<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Textfield from "@smui/textfield";
    import type { OnDialogClosedListener } from "./common";
    import { getAppropriatedString } from "$lib/strings";
    import { action, basic } from "$lib/strings/strings";

    export function open(event: OnDialogClosedListener) {
        onDialogClosed = event;
        visible = true;
    }

    export function close() {
        visible = false;
        onDialogClosed = undefined;
    }

    export function getFiles(): FileList | null {
        return files;
    }

    let visible: boolean = $state(false);
    let files: FileList | null = $state(null);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);
</script>

{/* @ts-ignore */ null}
<Dialog
    bind:open={visible}
    style="user-select: none;"
    onSMUIDialogClosed={onDialogClosed}
>
    <Title>{getAppropriatedString(basic.import_data)}</Title>
    <Content>
        <div class="dialog-content">
            <Textfield
                bind:files
                variant="outlined"
                type="file"
                accept=".json"
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

    :global(.dialog-content > * ~ *) {
        margin-top: 8px;
    }

    @media (min-width: 600px) {
        .dialog-content {
            margin: 0;
        }
    }
</style>
