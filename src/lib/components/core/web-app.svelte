<script lang="ts">
    import { onMount, tick } from "svelte";
    import { page } from "$app/state";
    import SmuiToolbar from "$lib/components/core/app-toolbar.svelte";
    import SmuiDrawer from "$lib/components/smui/smui-drawer.svelte";
    import SmuiDialogImport from "$lib/components/smui/dialogs/smui-dialog-import.svelte";
    import FragmentAuditLog from "$lib/components/fragments/fragment-audit-log.svelte";
    import FragmentManageTeams from "$lib/components/fragments/fragment-manage-teams.svelte";
    import FragmentOrganization from "$lib/components/fragments/fragment-organization.svelte";
    import FragmentCommissions from "$lib/components/fragments/fragment-commissions.svelte";
    import {
        Fragments,
        getFragmentForID,
        navigateToFragment,
        type FragmentPageState,
    } from "$lib/components/fragments/fragments";
    import { saveElementAsImage } from "$lib/utils/image-util";
    import type {
        DatabaseEditor,
        DatabaseOperations,
    } from "$lib/common/database/database-interfaces";
    import FragmentSettings from "$lib/components/fragments/fragment-settings.svelte";
    import FragmentAbout from "$lib/components/fragments/fragment-about.svelte";
    import FragmentProfile from "../fragments/fragment-profile.svelte";

    function onClickToolbar_DrawerMenu() {
        el_smuiDrawer.openDrawer();
    }

    function onClickToolbar_GenerateImage() {
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

    function onClickMenu__Login() {
        location.assign("/login");
    }

    function onClickMenu__Logout() {
        location.assign("/logout");
    }

    function onClickMenu__Profile() {
        navigateToFragment(Fragments.PROFILE);
    }

    // ------------------------------------------

    onMount(async () => {
        // Adicionar a referencia
        el_smuiDrawer.setDialogImportInstance(el_dialogImport);

        // https://github.com/sveltejs/kit/issues/11466
        await tick();

        // Fragmento na URL
        const search = new URLSearchParams(window.location.search);
        const searchFragment = search.get("fragment");
        const searchExtra = search.get("extra");

        if (searchFragment && searchFragment !== null) {
            const fragment = getFragmentForID(searchFragment);
            navigateToFragment(fragment, searchExtra);
        }
    });

    let el_smuiDrawer: SmuiDrawer;
    let el_fragmentOrganization: FragmentOrganization | null = $state(null);
    let el_fragmentManageTeams: FragmentManageTeams | null = $state(null);
    let el_fragmentAuditLog: FragmentAuditLog | null = $state(null);
    let el_dialogImport: SmuiDialogImport;
    let el_pageContent: HTMLDivElement;

    let lockExport = $state(false);
    let currentFragment: Fragments = $derived.by(() => {
        // Verificar qual fragmento foi definido no estado da pagina
        const state: FragmentPageState = page.state;
        const fragment = state.fragment || Fragments.UNDEFINED;

        // Atualizar a ui da pagina
        return fragment;
    });
    let showGenerateImageButton: boolean = $derived.by(() => {
        // Deixar visível o botão de gerar a imagem somente
        // no fragmento de equipes
        return currentFragment === Fragments.MANAGE_TEAMS;
    });

    $effect(() => {
        // Atualizar o item selecionado
        el_smuiDrawer.setActive(currentFragment);

        // Rolar a pagina para cima quando trocar de fragmento
        el_pageContent.scrollTo(0, 0);
    });

    // ------------------------------------------

    type ExportType = {
        database: DatabaseOperations & DatabaseEditor;

        title?: string;
        subtitle?: string;

        showProfileButton?: boolean;

        logged?: boolean;

        onClickMenuLogin?: () => void;
        onClickMenuLogout?: () => void;
        onClickMenuProfile?: () => void;

        children?: any;
    };
    let {
        database = $bindable(),

        title = $bindable(""),
        subtitle = $bindable(""),

        showProfileButton = false,
        logged = false,

        children,
    }: ExportType = $props();
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main class="app-container">
    <SmuiToolbar
        {title}
        {showGenerateImageButton}
        {showProfileButton}
        onClickDrawer={onClickToolbar_DrawerMenu}
        onClickGenerateImage={onClickToolbar_GenerateImage}
        {logged}
        onClickMenuLogin={onClickMenu__Login}
        onClickMenuLogout={onClickMenu__Logout}
        onClickMenuProfile={onClickMenu__Profile}
    />
    <SmuiDrawer
        bind:title
        bind:subtitle
        bind:database
        bind:this={el_smuiDrawer}
    />

    <!-- Conteúdo principal da pagina -->
    <div bind:this={el_pageContent} class="page-content">
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
        {:else if currentFragment === Fragments.PROFILE}
            <!-- Perfil do usuário -->
            <FragmentProfile />
        {:else}
            <div class="blank-page">
                {@render children?.()}
            </div>
        {/if}
    </div>

    <!-- Diálogos -->
    <SmuiDialogImport bind:this={el_dialogImport} />
</main>

<style>
    .app-container {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;
        flex-grow: 1;

        overflow-x: hidden;
        overflow-y: auto;
    }

    .page-content {
        width: 100%;
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
</style>
