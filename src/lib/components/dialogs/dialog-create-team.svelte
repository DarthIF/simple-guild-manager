<script lang="ts">
    import MaterialDialog from "./material-dialog.svelte";

    type DialogCreateTeam = {
        onConfirm?: (value: string) => void;
    };

    function handleConfirm() {
        if (!onConfirm) return;

        const value = el_input.value.trim();
        onConfirm(value);

        el_input.value = "";
    }

    export function show() {
        el_dialog.show();
    }

    export function hide() {
        el_dialog.hide();
    }

    let el_dialog: MaterialDialog;
    let el_input: HTMLInputElement;
    let { onConfirm }: DialogCreateTeam = $props();
</script>

<MaterialDialog
    bind:this={el_dialog}
    title="Criar nova equipe"
    cancelText="Cancelar"
    confirmText="Criar"
    onConfirmClick={handleConfirm}
>
    <div class="form-group">
        <label class="form-label" for="teamName">Nome da equipe</label>
        <input
            type="text"
            class="form-input"
            id="teamName"
            bind:this={el_input}
        />
    </div>
</MaterialDialog>

<style>
    @import "../form/form.css";
</style>
