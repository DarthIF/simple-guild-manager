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

    export function open() {
        visible = true;
    }

    export function close() {
        visible = false;
    }

    export function getValue() {
        return promptValue.trim();
    }

    export function setOnDialogClosed(event: OnDialogClosedListener) {
        onDialogClosed = event;
    }

    let promptValue: string = $state("");
    let visible: boolean = $state(false);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);

    let { title = "", label = "" } = $props();
</script>

<Dialog bind:open={visible} onSMUIDialogClosed={onDialogClosed}>
    <Title>{title}</Title>
    <Content>
        <div class="dialog-content">
            {/* @ts-ignore */ null}
            <Textfield
                bind:value={promptValue}
                {label}
                required
                variant="outlined"
            />
        </div>
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
