<script lang="ts">
    import {
        Database,
        ReactiveData,
    } from "$lib/utils/reactive-database.svelte";
    import { onMount } from "svelte";
    import MaterialSymbols from "../remover/material-symbols.svelte";
    import DialogImport from "../dialogs/dialog-import.svelte";
    import DrawerItem from "./drawer-item.svelte";

    export function getDrawer(): HTMLDivElement {
        return el_drawer;
    }

    export function getDrawerOverlay(): HTMLDivElement {
        return el_drawerOverlay;
    }

    export function open() {
        el_drawer.classList.add("open");
        el_drawerOverlay.classList.add("open");
    }

    export function close() {
        el_drawer.classList.remove("open");
        el_drawerOverlay.classList.remove("open");
    }

    export function setDialogImportInstance(dialog: DialogImport) {
        ref_dialogImport = dialog;
    }

    function onClickListenerExportData() {
        Database.exportData();
    }

    function onClickListenerImportData() {
        ref_dialogImport.setOnConfirm((files) => {
            const file = files?.[0];
            if (!file) {
                alert("Por favor, selecione um arquivo JSON.");
                return;
            }

            Database.importData(file);
        });
        ref_dialogImport.show();
    }

    onMount(() => {
        el_drawerOverlay.addEventListener("click", close);
    });

    let ref_dialogImport: DialogImport;

    let el_drawer: HTMLDivElement;
    let el_drawerOverlay: HTMLDivElement;

    let { children } = $props();
</script>

<div class="drawer-container">
    <!-- Drawer overlay (mobile) -->
    <div class="drawer-overlay" bind:this={el_drawerOverlay}></div>

    <!-- Drawer -->
    <div class="drawer" bind:this={el_drawer}>
        <div class="drawer-header">
            <div class="drawer-item-icon">
                <MaterialSymbols icon="groups" />
            </div>
            <span id="drawerOrgName">
                {ReactiveData.organization}
            </span>
        </div>

        <div class="drawer-content">
            <!-- Navegação -->
            <DrawerItem
                text="Gerenciar Organização"
                icon="settings"
                href="#manageOrg"
                onClick={close}
            />
            <DrawerItem
                text="Gerenciar Equipes"
                icon="diversity_3"
                href="#manageTeams"
                onClick={close}
            />
            <DrawerItem
                text="Comissões"
                icon="sports_martial_arts"
                href="#manageCommissions"
                onClick={close}
            />
            <DrawerItem
                text="Registro de Auditoria"
                icon="history"
                href="#auditLog"
                onClick={close}
            />

            <div class="big-space"></div>

            <!-- Importar/Exportar -->
            <DrawerItem
                text="Exportar Dados"
                icon="file_download"
                onClick={onClickListenerExportData}
            />
            <DrawerItem
                text="Importar Dados"
                icon="file_upload"
                onClick={onClickListenerImportData}
            />
        </div>
    </div>

    <!-- Renderizar o elemento filho, equivalente ao <slot/> do Svelte v4 -->
    {@render children?.()}
</div>

<style>
    .drawer-container {
        display: flex;
        flex: 1;
        overflow: hidden;
    }

    .drawer {
        width: 250px;
        background-color: var(--surface);
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
    }

    :global(.drawer.open) {
        transform: translateX(0);
    }

    .drawer-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 15;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    :global(.drawer-overlay.open) {
        opacity: 1;
        pointer-events: auto;
    }

    .drawer-header {
        height: 72px;
        padding: 16px;

        background-color: var(--primary-dark);
        color: var(--on-primary);

        display: flex;
        align-items: center;

        user-select: none;
    }

    .drawer-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        overflow-y: auto;
        user-select: none;
    }

    .big-space {
        flex-grow: 1;
    }

    /* Responsive adjustments */
    @media (min-width: 992px) {
        .drawer {
            position: relative;
            transform: translateX(0);
        }

        .drawer-overlay {
            display: none;
        }

        .drawer-header {
            display: none;
        }
    }
</style>
