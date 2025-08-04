<script lang="ts">
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialButton from "../buttons/material-button.svelte";

    type MaterialDialogType = {
        title?: string;
        showCancel?: boolean;
        showConfirm?: boolean;
        cancelText?: string;
        confirmText?: string;
        onCancelClick?: () => void;
        onConfirmClick?: () => void;
        children?: any;
    };

    function handleCancelClick() {
        onCancelClick?.();
        hide();
    }

    function handleConfirmClick() {
        onConfirmClick?.();
        hide();
    }

    export function show() {
        el_overlay.classList.add("open");
    }

    export function hide() {
        el_overlay.classList.remove("open");
    }

    let el_overlay: HTMLDivElement;
    let el_dialog: HTMLDivElement;
    let {
        title = "",
        showCancel = true,
        showConfirm = true,
        cancelText = "Cancelar",
        confirmText = "Confirmar",
        onCancelClick,
        onConfirmClick,
        children,
    }: MaterialDialogType = $props();
</script>

<div class="dialog-overlay" bind:this={el_overlay}>
    <div class="dialog" bind:this={el_dialog}>
        <div class="dialog-title">{title}</div>
        <div class="dialog-content">
            <!-- Renderizar o elemento filho, equivalente ao <slot/> do Svelte v4 -->
            {@render children?.()}
        </div>
        <div class="dialog-actions">
            {#if showCancel}
                <MaterialButton
                    style="margin-right: 8px;"
                    type={ButtonTypes.SECONDARY}
                    onClick={handleCancelClick}
                >
                    {cancelText}
                </MaterialButton>
            {/if}
            {#if showConfirm}
                <MaterialButton
                    type={ButtonTypes.PRIMARY}
                    onClick={handleConfirmClick}
                >
                    {confirmText}
                </MaterialButton>
            {/if}
        </div>
    </div>
</div>

<style>
    @import "./dialog.css";
</style>
