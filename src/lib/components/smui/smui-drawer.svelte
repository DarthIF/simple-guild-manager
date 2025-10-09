<script lang="ts">
    import { onMount } from "svelte";
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
    import { alertWith, getAppropriatedString } from "$lib/strings";
    import { basic, database_strings } from "$lib/strings/strings";
    import { DialogActions } from "./dialogs/common";
    import { ReactiveDB } from "$lib/client/reactive-database.svelte";
    import type { DatabaseEditor } from "$lib/common/database/database-interfaces";
    import {
        ReactiveSettings,
        THEN_CALLBACK_COMPLETE_LOAD,
    } from "$lib/client/settings.svelte";
    import { Fragments } from "../fragments/fragments";

    export function setActive(value: string) {
        active = value;
        open = false;

        updateOverlay();
    }

    export function openDrawer() {
        open = true;
        updateOverlay();
    }

    export function closeDrawer() {
        open = false;
        updateOverlay();
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

    function updateOverlay() {
        if (open) {
            el_drawerOverlay.classList.add("open");
        } else {
            el_drawerOverlay.classList.remove("open");
        }
    }

    onMount(() => {
        updateOverlay();
    });

    let ref_dialogImport: SmuiDialogImport;
    let el_drawerOverlay: HTMLDivElement;

    type ExportType = {
        open?: boolean;
        active?: string;
        database: DatabaseEditor;
    };
    let {
        open = false,
        active = "",
        database = $bindable(),
    }: ExportType = $props();
</script>

<!--
    @component
    https://sveltematerialui.com/demo/drawer/
-->

<Drawer style="user-select: none;" variant="modal" fixed={false} {open}>
    <Header>
        <Title>{ReactiveDB.definitions.guild}</Title>
        <Subtitle>{getAppropriatedString(basic.subtitle)}</Subtitle>
    </Header>
    <Content>
        <List>
            <Separator />

            <Item href="#" activated={active === ""} onclick={closeDrawer}>
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    home
                </Graphic>
                <Text>{getAppropriatedString(basic.home)}</Text>
            </Item>

            <Item
                href={Fragments.MANAGE_ORGANIZATION}
                activated={active === "#manageOrg"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    empty_dashboard
                </Graphic>
                <Text>{getAppropriatedString(basic.manage_org)}</Text>
            </Item>
            <Item
                href={Fragments.MANAGE_TEAMS}
                activated={active === "#manageTeams"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    diversity_3
                </Graphic>
                <Text>{getAppropriatedString(basic.teams)}</Text>
            </Item>
            <Item
                href={Fragments.COMMISSIONS}
                activated={active === "#manageCommissions"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    sports_martial_arts
                </Graphic>
                <Text>{getAppropriatedString(basic.commissions)}</Text>
            </Item>
            <Item
                href={Fragments.AUDIT_LOG}
                activated={active === "#auditLog"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    history
                </Graphic>
                <Text>{getAppropriatedString(basic.audit_log)}</Text>
            </Item>

            <Separator />
            <Subheader tag="h6">
                {getAppropriatedString(basic.category_database)}
            </Subheader>

            <Item onclick={onClickListenerExportData}>
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    save
                </Graphic>
                <Text>
                    {getAppropriatedString(basic.export_data)}
                </Text>
            </Item>
            <Item onclick={onClickListenerImportData}>
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    upload_file
                </Graphic>
                <Text>
                    {getAppropriatedString(basic.import_data)}
                </Text>
            </Item>

            <Separator />
            <Subheader tag="h6">Simple Guild Manager</Subheader>
            <Item
                href={Fragments.SETTINGS}
                activated={active === "#settings"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    settings
                </Graphic>
                <Text>{getAppropriatedString(basic.settings)}</Text>
            </Item>
            <Item
                href={Fragments.ABOUT}
                activated={active === "#about"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    info
                </Graphic>
                <Text>{getAppropriatedString(basic.about)}</Text>
            </Item>
            <Separator />
            <Item onclick={() => {}}>
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    folder_data
                </Graphic>
                <Text>
                    {getAppropriatedString(basic.source_code)}
                </Text>
            </Item>
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
