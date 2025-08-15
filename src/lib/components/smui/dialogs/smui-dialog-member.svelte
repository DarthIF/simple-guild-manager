<script lang="ts">
    import Dialog, {
        Title,
        Content,
        Actions,
        InitialFocus,
    } from "@smui/dialog";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import type { MemberType } from "$lib/utils/reactive-database.svelte";
    import type { OnDialogClosedListener } from "./common";

    export function open(edit: MemberType | null = null) {
        if (edit != null) {
            editMember = edit;

            valueName = edit.name;
            valuePower = edit.power.toString();
        } else {
            editMember = null;

            valueName = "";
            valuePower = "0";
        }

        visible = true;
    }

    export function close() {
        visible = false;
    }

    export function getName(): string {
        return valueName.trim();
    }

    export function getPower(): string {
        return valuePower.trim() || "0";
    }

    export function getEditingMember(): MemberType | null {
        return editMember;
    }

    export function isInEditMode(): boolean {
        return isEditMode;
    }

    export function setOnDialogClosed(event: OnDialogClosedListener) {
        onDialogClosed = event;
    }

    let editMember: MemberType | null = $state(null);
    let isEditMode: boolean = $derived(editMember !== null);

    let visible: boolean = $state(false);
    let onDialogClosed: OnDialogClosedListener | undefined = $state(undefined);

    let valueName: string = $state("");
    let valuePower: string = $state("");
</script>

<Dialog bind:open={visible} onSMUIDialogClosed={onDialogClosed}>
    <Title>Add member</Title>
    <Content>
        <div class="dialog-content">
            {/* @ts-ignore */ null}
            <Textfield
                bind:value={valueName}
                label="Name"
                required
                variant="outlined"
            />

            {/* @ts-ignore */ null}
            <Textfield
                bind:value={valuePower}
                label="Power"
                required
                variant="outlined"
            />
        </div>
    </Content>
    <Actions>
        {#if isEditMode}
            <Button style="margin-right: auto;" action="delete">
                <Label>Delete</Label>
            </Button>
        {/if}

        <Button action="cancel">
            <Label>Cancel</Label>
        </Button>
        <Button action="accept">
            <Label>Done</Label>
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
