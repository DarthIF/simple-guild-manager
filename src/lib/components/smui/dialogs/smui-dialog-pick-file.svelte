<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import InputFile from "$lib/components/misc/input-file.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { action, basic } from "$lib/strings/strings";
    import type { OnDialogClosedListener } from "./common";
    import type { Undefinable } from "$lib/utils/types";

    let visible: boolean = $state(false);
    let files: FileList | null = $state(null);
    let onDialogClosed: Undefinable<OnDialogClosedListener> = $state(undefined);
</script>

<Dialog
    bind:open={visible}
    style="user-select: none;"
    onSMUIDialogClosed={onDialogClosed}
>
    <Title>{getAppropriatedString(basic.import_data)}</Title>
    <Content>
        <InputFile
            id="file-upload"
            icon="file_json"
            accept=".json"
            bind:files
        />
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
</style>
