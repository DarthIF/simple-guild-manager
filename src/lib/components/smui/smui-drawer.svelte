<script lang="ts">
    import Drawer, {
        AppContent,
        Content,
        Header,
        Title,
        Subtitle,
        Scrim,
    } from "@smui/drawer";
    import List, {
        Item,
        Text,
        Graphic,
        Separator,
        Subheader,
        Meta,
    } from "@smui/list";
    import SmuiDialogImport from "./dialogs/smui-dialog-import.svelte";
    import {
        alertWith,
        getAppropriatedString,
        type LocalizedString,
    } from "$lib/strings";
    import { basic, database_strings } from "$lib/strings/strings";
    import { DialogActions } from "./dialogs/common";
    import { ReactiveDB } from "$lib/client/reactive-db.svelte";
    import type { DatabaseEditor } from "$lib/common/database/database-interfaces";
    import {
        ReactiveSettings,
        THEN_CALLBACK_COMPLETE_LOAD,
    } from "$lib/client/settings.svelte";
    import { Fragments, navigateToFragment } from "../fragments/fragments";

    export function setActive(value: string) {
        active = value;
        open = false;
    }

    export function openDrawer() {
        open = true;
    }

    export function closeDrawer() {
        // Atualizar a variável, a UI sera
        // atualizada na função effect
        open = false;
    }

    export function setDialogImportInstance(dialog: SmuiDialogImport) {
        ref_dialogImport = dialog;
    }

    function onClickListenerExportData() {
        database.exportData();
    }

    function onClickListenerImportData() {
        ref_dialogImport.open((e) => {
            // Cancelou
            if (e.detail.action !== DialogActions.ACCEPT) {
                return;
            }

            // Verificar o arquivo
            const files = ref_dialogImport.getFiles();
            const file = files?.[0];
            if (!file) {
                alertWith(database_strings.import_data_invalid_type);
                return;
            }

            // Importar o arquivo
            ReactiveSettings.loading = true;
            database.importData(file).then(THEN_CALLBACK_COMPLETE_LOAD);
        });
    }

    function isActive(fragmentID: string) {
        return active === fragmentID;
    }

    let ref_dialogImport: SmuiDialogImport;
    let el_drawerOverlay: HTMLDivElement;

    $effect(() => {
        if (open) {
            el_drawerOverlay.classList.add("open");
        } else {
            el_drawerOverlay.classList.remove("open");
        }
    });

    type ExportType = {
        /**
         * Titulo
         */
        title?: string;
        /**
         * Subtitulo
         */
        subtitle?: string;
        /**
         * Abrir ou fechar a drawer
         */
        open?: boolean;
        /**
         * Item selecionado atualmente
         */
        active?: string;
        /**
         * Instancia banco de dados usado para exportar ou importar
         */
        database: DatabaseEditor;
    };
    let {
        title = $bindable(""),
        subtitle = $bindable(""),
        open = $bindable(false),
        active = $bindable(""),
        database = $bindable(),
    }: ExportType = $props();
</script>

<!--
    @component
    https://sveltematerialui.com/demo/drawer/
-->

<!-- Modelo de item da Drawer -->
{#snippet MItem(
    icon: string,
    text: string | LocalizedString,
    activated: boolean,
    onclick: () => void,
)}
    <Item {activated} {onclick}>
        <Graphic class="material-symbols-rounded" aria-hidden="true">
            {icon}
        </Graphic>
        <Text>
            {getAppropriatedString(text)}
        </Text>
    </Item>
{/snippet}

<!-- Drawer -->
<Drawer style="user-select: none;" variant="modal" fixed={false} {open}>
    <Header>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
    </Header>
    <Content>
        <List>
            <Separator />

            {@render MItem(
                "home",
                basic.home,
                isActive(Fragments.UNDEFINED),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.UNDEFINED);
                },
            )}
            {@render MItem(
                "empty_dashboard",
                basic.manage_org,
                isActive(Fragments.MANAGE_ORGANIZATION),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.MANAGE_ORGANIZATION);
                },
            )}
            {@render MItem(
                "diversity_3",
                basic.teams,
                isActive(Fragments.MANAGE_TEAMS),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.MANAGE_TEAMS);
                },
            )}
            {@render MItem(
                "sports_martial_arts",
                basic.commissions,
                isActive(Fragments.COMMISSIONS),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.COMMISSIONS);
                },
            )}
            {@render MItem(
                "history",
                basic.audit_log,
                isActive(Fragments.AUDIT_LOG),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.AUDIT_LOG);
                },
            )}

            <Separator />
            <Subheader tag="h6">
                {getAppropriatedString(basic.category_database)}
            </Subheader>

            {@render MItem(
                "save",
                basic.export_data,
                false,
                onClickListenerExportData,
            )}
            {@render MItem(
                "upload_file",
                basic.import_data,
                false,
                onClickListenerImportData,
            )}

            <Separator />
            <Subheader tag="h6">Simple Guild Manager</Subheader>

            {@render MItem(
                "settings",
                basic.settings,
                isActive(Fragments.SETTINGS),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.SETTINGS);
                },
            )}
            {@render MItem(
                "info",
                basic.about,
                isActive(Fragments.ABOUT),
                () => {
                    closeDrawer();
                    navigateToFragment(Fragments.ABOUT);
                },
            )}

            <Separator />

            {@render MItem("folder_data", basic.source_code, false, () => {
                window.open(
                    "https://github.com/DarthIF/simple-guild-manager",
                    "_blank",
                );
            })}
        </List>
    </Content>
</Drawer>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    bind:this={el_drawerOverlay}
    class="drawer-overlay"
    onclick={closeDrawer}
></div>

<style>
    .drawer-overlay {
        z-index: 4;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        pointer-events: none;
        user-select: none;
        transition: opacity 0.3s ease;
    }

    :global(.drawer-overlay.open) {
        opacity: 1;
        pointer-events: auto;
    }
</style>
