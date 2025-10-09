<script lang="ts">
    import { onMount } from "svelte";
    import SmuiToolbar from "$lib/components/smui/smui-toolbar.svelte";
    import SmuiDrawer from "$lib/components/smui/smui-drawer.svelte";
    import SmuiDialogImport from "$lib/components/smui/dialogs/smui-dialog-import.svelte";
    import FragmentAuditLog from "$lib/components/fragments/fragment-audit-log.svelte";
    import FragmentManageTeams from "$lib/components/fragments/fragment-manage-teams.svelte";
    import FragmentOrganization from "$lib/components/fragments/fragment-organization.svelte";
    import FragmentCommissions from "$lib/components/fragments/fragment-commissions.svelte";
    import { Fragments } from "$lib/components/fragments/fragments";
    import { saveElementAsImage } from "$lib/utils/image-util";
    import type {
        DatabaseEditor,
        DatabaseOperations,
    } from "$lib/common/database/database-interfaces";
    import { ReactiveDB } from "$lib/client/reactive-database.svelte";
    import FragmentSettings from "$lib/components/fragments/fragment-settings.svelte";
    import FragmentAbout from "$lib/components/fragments/fragment-about.svelte";

    function ev_OnClickListener_ToolbarDrawerMenu() {
        el_smuiDrawer.openDrawer();
    }

    function ev_OnClickListener_ToolbarGenerateImage() {
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

    function updateHash() {
        const newHash = window.location.hash;

        // Desativar o botão
        enableGenerateImageButton = false;

        // Atualizar o fragmento
        let found = false;
        for (const fragmentID of Object.values(Fragments)) {
            if (fragmentID !== newHash) continue;

            currentFragment = fragmentID;
            found = true;
        }

        if (!found) {
            currentFragment = Fragments.UNDEFINED;
        }

        // Atualizar o item selecionado
        el_smuiDrawer.setActive(newHash);
    }

    onMount(() => {
        // Renderizar o fragmento
        window.addEventListener("hashchange", (e) => updateHash());
        updateHash();

        // Adicionar a referencia
        el_smuiDrawer.setDialogImportInstance(el_dialogImport);
    });

    let lockExport = false;
    let currentFragment: Fragments = $state(Fragments.UNDEFINED);
    let enableGenerateImageButton: boolean = $derived.by(() => {
        // Deixar visível o botão de gerar a imagem somente
        // no fragmento de equipes
        return currentFragment === Fragments.MANAGE_TEAMS;
    });

    let el_smuiDrawer: SmuiDrawer;
    let el_fragmentOrganization: FragmentOrganization | null = $state(null);
    let el_fragmentManageTeams: FragmentManageTeams | null = $state(null);
    let el_fragmentAuditLog: FragmentAuditLog | null = $state(null);
    let el_dialogImport: SmuiDialogImport;

    type ExportType = { database: DatabaseOperations & DatabaseEditor };
    let { database = $bindable() }: ExportType = $props();
</script>

<main class="app-container">
    <SmuiToolbar
        title={ReactiveDB.definitions.guild}
        showGenerateImageButton={enableGenerateImageButton}
        onClickDrawer={ev_OnClickListener_ToolbarDrawerMenu}
        onClickGenerateImage={ev_OnClickListener_ToolbarGenerateImage}
    />
    <SmuiDrawer bind:this={el_smuiDrawer} bind:database />

    <!-- Conteúdo principal da pagina -->
    <div class="page-content">
        {#if currentFragment === Fragments.MANAGE_ORGANIZATION}
            <!-- Gerenciar Guilda -->
            <FragmentOrganization
                bind:this={el_fragmentOrganization}
                bind:database
            />
        {:else if currentFragment === Fragments.MANAGE_TEAMS}
            <!-- Gerenciar equipes -->
            <FragmentManageTeams
                bind:this={el_fragmentManageTeams}
                bind:database
            />
        {:else if currentFragment === Fragments.COMMISSIONS}
            <!-- Comissões -->
            <FragmentCommissions bind:database />
        {:else if currentFragment === Fragments.AUDIT_LOG}
            <!-- Registro de auditoria -->
            <FragmentAuditLog bind:this={el_fragmentAuditLog} />
        {:else if currentFragment === Fragments.SETTINGS}
            <!-- Configurações -->
            <FragmentSettings />
        {:else if currentFragment === Fragments.ABOUT}
            <!-- Sobre o App -->
            <FragmentAbout />
        {:else}
            <div class="blank-page">
                <div class="information">
                    <h2>Informação</h2>
                    <h6>
                        O banco de dados fica salvo no seu navegador, e os dados
                        não são sincronizados entre dispositivos.
                    </h6>
                </div>
            </div>
        {/if}
    </div>

    <!-- Diálogos -->
    <SmuiDialogImport bind:this={el_dialogImport} />
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

    .blank-page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .information {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
</style>
