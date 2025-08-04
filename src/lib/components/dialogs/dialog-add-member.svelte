<script lang="ts">
    import { formatNumberCompact } from "$lib/utils/number-util";
    import {
        Database,
        GameEvents,
        type MemberType,
        type TeamType,
    } from "$lib/utils/reactive-database.svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialButton from "../buttons/material-button.svelte";
    import MaterialDialog from "./material-dialog.svelte";

    export async function show() {
        if (!targetEvent) {
            console.error(
                "Erro ao exibir o diálogo. Não foi fornecido o evento do jogo.",
            );
            return;
        }

        if (!targetTeam) {
            console.error(
                "Erro ao exibir o diálogo. Não foi fornecido um time.",
            );
            return;
        }

        freeMembers = Database.listFreeMembers(targetEvent);
        el_dialog.show();
    }

    export async function showFor(gameEvent: GameEvents, team: TeamType) {
        targetEvent = gameEvent;
        targetTeam = team;

        await show();
    }

    export async function hide() {
        el_dialog.hide();
        targetTeam = null;
    }

    // ------------------------------------------

    function getMemberString(member: MemberType) {
        return `${member.name} (Poder: ${formatNumberCompact(member.power)})`;
    }

    function addMemberToTeam(member: MemberType) {
        if (!targetEvent) {
            alert("targetEvent null");
            return;
        }

        if (!targetTeam) {
            alert("targetTeam null");
            return;
        }

        Database.addMemberToTeamV2(targetEvent, targetTeam.id, member.id);
    }

    let freeMembers: MemberType[] = $state([]);
    let targetEvent: GameEvents | null = $state(null);
    let targetTeam: TeamType | null = $state(null);

    let el_dialog: MaterialDialog;
</script>

<MaterialDialog
    bind:this={el_dialog}
    title={`Adicionar membro à equipe${targetTeam ? ` (${targetTeam.name})` : ""}`}
    cancelText="Cancelar"
    showConfirm={false}
    showCancel={true}
>
    <ul class="list">
        <!-- Available members will be added here dynamically -->
        {#if freeMembers.length === 0}
            <li class="list-item">Nenhum membro disponível</li>
        {:else}
            {#each freeMembers as member}
                <li class="list-item">
                    <div>{getMemberString(member)}</div>
                    <MaterialButton
                        type={ButtonTypes.PRIMARY}
                        onClick={() => {
                            addMemberToTeam(member);
                            hide();
                        }}
                    >
                        Adicionar
                    </MaterialButton>
                </li>
            {/each}
        {/if}
    </ul>
</MaterialDialog>

<style>
    @import "../list/list.css";
</style>
