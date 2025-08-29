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
        return el_input.files;
    }

    let visible: boolean = $state(false);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);

    let el_input: HTMLInputElement;
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
            {/* @ts-ignore */ null}
            <Textfield
                bind:this={el_input}
                required
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

<style></style>
