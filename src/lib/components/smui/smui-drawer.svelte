<script lang="ts">
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";
    import {
        Database,
        ReactiveData,
    } from "$lib/utils/reactive-database.svelte";
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
    } from "@smui/list";
    import { onMount } from "svelte";
    import DialogImport from "../dialogs/dialog-import.svelte";

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

    let ref_dialogImport: DialogImport;
    let el_drawerOverlay: HTMLDivElement;
    let { open = false, active = "Inbox" } = $props();
</script>

<!--
    @component
    https://sveltematerialui.com/demo/drawer/
-->

<Drawer style="user-select: none;" variant='modal' fixed={false} {open}>
    <Header>
        <Title>{ReactiveData.organization}</Title>
        <Subtitle>{getAppropriatedString(basic.subtitle)}</Subtitle>
    </Header>
    <Content>
        <List>
            <Separator />

            <Item
                href="#manageOrg"
                activated={active === "#manageOrg"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    settings
                </Graphic>
                <Text>{getAppropriatedString(basic.manage_org)}</Text>
            </Item>
            <Item
                href="#manageTeams"
                activated={active === "#manageTeams"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    diversity_3
                </Graphic>
                <Text>{getAppropriatedString(basic.teams)}</Text>
            </Item>
            <Item
                href="#manageCommissions"
                activated={active === "#manageCommissions"}
                onclick={closeDrawer}
            >
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    sports_martial_arts
                </Graphic>
                <Text>{getAppropriatedString(basic.commissions)}</Text>
            </Item>
            <Item
                href="#auditLog"
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
                    file_download
                </Graphic>
                <Text>
                    {getAppropriatedString(basic.export_data)}
                </Text>
            </Item>
            <Item onclick={onClickListenerImportData}>
                <Graphic class="material-symbols-rounded" aria-hidden="true">
                    file_upload
                </Graphic>
                <Text>
                    {getAppropriatedString(basic.import_data)}
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
