<script lang="ts">
    import MaterialDialog from "./material-dialog.svelte";

    type ConfirmListener = (files: FileList | null) => void;

    function ev_OnClickListener_Confirm() {
        hide();

        temp_click?.(el_input.files);
        temp_click = null;
    }

    function ev_OnClickListener_Cancel() {
        hide();
    }

    export function show() {
        el_dialog.show();
    }

    export function hide() {
        el_dialog.hide();
    }

    export function setOnConfirm(temp: ConfirmListener) {
        temp_click = temp;
    }

    let temp_click: ConfirmListener | null = null;

    let el_dialog: MaterialDialog;
    let el_input: HTMLInputElement;
</script>

<MaterialDialog
    bind:this={el_dialog}
    title="Importar Dados"
    showConfirm={true}
    showCancel={true}
    confirmText="Importar"
    cancelText="Cancelar"
    onConfirmClick={ev_OnClickListener_Confirm}
    onCancelClick={ev_OnClickListener_Cancel}
>
    <div class="form-group">
        <label class="form-label" for="importFile">
            Selecione o arquivo JSON
        </label>
        <input
            type="file"
            class="form-input"
            id="importFile"
            accept=".json"
            bind:this={el_input}
        />
    </div>
</MaterialDialog>

<style>
    @import "./dialog.css";
    @import "../form/form.css";
</style>
