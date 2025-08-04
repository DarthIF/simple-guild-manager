<script lang="ts">
    import { onMount } from "svelte";
    import DrawerLayout from "$lib/components/drawer/drawer-layout.svelte";
    import Fab from "$lib/components/fab.svelte";
    import Toolbar from "$lib/components/toolbar.svelte";
    import {
        Database,
        GameEvents,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { Fragments } from "$lib/components/fragments/fragments";
    import FragmentAuditLog from "$lib/components/fragments/fragment-audit-log.svelte";
    import FragmentManageTeams from "$lib/components/fragments/fragment-manage-teams.svelte";
    import FragmentOrganization from "$lib/components/fragments/fragment-organization.svelte";
    import DialogAddMember from "$lib/components/dialogs/dialog-add-member.svelte";
    import DialogCreateTeam from "$lib/components/dialogs/dialog-create-team.svelte";
    import DialogImport from "$lib/components/dialogs/dialog-import.svelte";
    import { saveElementAsImage } from "$lib/utils/image-util";
    import FragmentCommissions from "$lib/components/fragments/fragment-commissions.svelte";

    function ev_OnConfirmCreateTeam(value: string) {
        if (!el_fragmentManageTeams) return;

        if (!value) {
            alert("error invalid name");
            return;
        }

        // Criar o time
        const gameEvent = el_fragmentManageTeams.getCurrentGameEvent();
        Database.addTeam(gameEvent, value);
    }

    function ev_FabClick() {
        el_dialogCreateTeam.show();
    }

    function ev_OnClickListener_AddMember(
        gameEvent: GameEvents,
        team: TeamType,
    ) {
        // Mostra o dialogo para adicionar membros
        el_dialogAddMember.showFor(gameEvent, team);
    }

    function ev_OnClickListener_DeleteTeam(
        gameEvent: GameEvents,
        team: TeamType,
    ) {
        if (!el_fragmentManageTeams) return;
        if (!confirm("DELETE?")) return;

        // Deletar o time 
        Database.deleteTeam(gameEvent, team);
    }

    function ev_OnClickListener_ToolbarDrawerMenu() {
        el_drawer.open();
    }

    function ev_OnClickListener_ToolbarExport() {
        if (lockExport || !el_fragmentManageTeams) {
            console.error("Aguarde...");
            return;
        }

        lockExport = true;

        const root = el_fragmentManageTeams.getElementToRender();
        saveElementAsImage(root, "teams").then(() => {
            lockExport = false;
        });
    }

    // ------------------------------------------

    function onUpdateHash(newHash: string | null = null) {
        if (newHash === null) {
            newHash = window.location.hash;
        }

        if (newHash !== "#manageTeams") {
            el_fab.hide();
            enableExportButton = false;
        }

        // Atualizar o fragmento
        switch (newHash) {
            case "#manageOrg":
                currentFragment = Fragments.MANAGE_ORGANIZATION;
                break;
            case "#manageTeams":
                currentFragment = Fragments.MANAGE_TEAMS;

                el_fab.show();
                enableExportButton = true;
                break;
            case "#manageCommissions":
                currentFragment = Fragments.COMMISSIONS;
                break;
            case "#auditLog":
                currentFragment = Fragments.AUDIT_LOG;
                break;
            default:
                currentFragment = Fragments.UNDEFINED;
                break;
        }
    }

    onMount(() => {
        // Carregar o banco de dados no cache
        Database.loadData();

        // Visibilidade do FAB

        // Renderizar o fragmento
        window.addEventListener("hashchange", (e) => onUpdateHash());
        onUpdateHash();

        // Adicionar a referencia
        el_drawer.setDialogImportInstance(el_dialogImport);
    });

    let lockExport = false;
    let currentFragment: Fragments = $state(Fragments.UNDEFINED);
    let enableExportButton: boolean = $state(false);

    let el_drawer: DrawerLayout;
    let el_fab: Fab;
    let el_fragmentOrganization: FragmentOrganization | null = $state(null);
    let el_fragmentManageTeams: FragmentManageTeams | null = $state(null);
    let el_fragmentAuditLog: FragmentAuditLog | null = $state(null);
    let el_dialogCreateTeam: DialogCreateTeam;
    let el_dialogAddMember: DialogAddMember;
    let el_dialogImport: DialogImport;
</script>

<main class="app-container">
    <Toolbar
        showExportImage={enableExportButton}
        onDrawerClick={ev_OnClickListener_ToolbarDrawerMenu}
        onExportImgClick={ev_OnClickListener_ToolbarExport}
    />
    <DrawerLayout bind:this={el_drawer}>
        <!-- Main content -->
        <div class="page-content">
            {#if currentFragment === Fragments.MANAGE_ORGANIZATION}
                <!-- Manage Organization Page -->
                <FragmentOrganization bind:this={el_fragmentOrganization} />
            {:else if currentFragment === Fragments.MANAGE_TEAMS}
                <!-- Manage Teams Page -->
                <FragmentManageTeams
                    bind:this={el_fragmentManageTeams}
                    onAddMemberClick={ev_OnClickListener_AddMember}
                    onDeleteTeamClick={ev_OnClickListener_DeleteTeam}
                />
            {:else if currentFragment === Fragments.COMMISSIONS}
                <!-- Commissions fragment -->
                <FragmentCommissions />
            {:else if currentFragment === Fragments.AUDIT_LOG}
                <!-- Audit Log Page -->
                <FragmentAuditLog bind:this={el_fragmentAuditLog} />
            {/if}
        </div>
    </DrawerLayout>

    <Fab bind:this={el_fab} onClick={ev_FabClick} />

    <!-- Diálogos -->
    <DialogCreateTeam
        bind:this={el_dialogCreateTeam}
        onConfirm={ev_OnConfirmCreateTeam}
    />

    <DialogAddMember bind:this={el_dialogAddMember} />
    <DialogImport bind:this={el_dialogImport} />
</main>

<style>
    .app-container {
        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: column;

        overflow-x: hidden;
        overflow-y: auto;
    }

    .page-content {
        position: relative;
        overflow-y: auto;
        flex: 1;
    }
</style>
