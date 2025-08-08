<script lang="ts">
    import {
        Database,
        ReactiveData,
        type MemberType,
    } from "$lib/utils/reactive-database.svelte";
    import { onMount } from "svelte";
    import MaterialButton from "../buttons/material-button.svelte";
    import { ButtonTypes } from "../buttons/button-types";
    import MaterialIconButton from "../buttons/material-icon-button.svelte";
    import MaterialSymbols from "../material-symbols.svelte";

    function ev_OnClickListener_ResetCycle() {
        if (
            confirm(
                "Deseja reiniciar o ciclo de comissões? Essa ação irá limpar a lista de quem fechou as comissões, e não pode ser desfeita.",
            )
        ) {
            console.error("NAO IMPLEMENTADO");
        }
    }

    onMount(() => {});

    let availableMembers = $derived.by(Database.listCommissionAvailableMembers);
    let closedMembers = $derived.by(Database.listCommissionClosedMembers);
    let excludedMembers = $derived.by(Database.listCommissionExcludedMembers);
</script>

<div class="fragment">
    <div class="actions">
        <MaterialButton
            type={ButtonTypes.SECONDARY}
            onClick={ev_OnClickListener_ResetCycle}
        >
            Reiniciar Ciclo
        </MaterialButton>
    </div>
    <div class="commission-grid">
        <div class="card">
            <div class="card-title commission-card-title">
                <MaterialSymbols icon="quick_reference_all" />
                <span>Disponível</span>
            </div>

            <div class="members-list">
                {#each availableMembers as member}
                    <div class="members-list-item">
                        <span>{member.name}</span>
                        <MaterialIconButton
                            icon="approval_delegation"
                            onClick={() => {
                                Database.addMemberToCommissionClosed(member);
                            }}
                        />
                        <MaterialIconButton
                            icon="group_remove"
                            onClick={() => {
                                Database.addMemberToCommissionExcluded(member);
                            }}
                        />
                    </div>
                {/each}
            </div>
        </div>

        <div class="card">
            <div class="card-title commission-card-title">
                <MaterialSymbols icon="approval_delegation" />
                <span>Fechado</span>
            </div>

            <div class="members-list">
                {#each closedMembers as member}
                    <div class="members-list-item">
                        <span>{member.name}</span>
                        <MaterialIconButton
                            icon="close"
                            onClick={() => {
                                Database.removeMemberToCommissionClosed(member);
                            }}
                        />
                    </div>
                {/each}
            </div>
        </div>

        <div class="card">
            <div class="card-title commission-card-title">
                <MaterialSymbols icon="group_remove" />
                <span>Excluído</span>
            </div>

            <div class="members-list">
                {#each excludedMembers as member}
                    <div class="members-list-item">
                        <span>{member.name}</span>
                        <MaterialIconButton
                            icon="close"
                            onClick={() => {
                                Database.removeMemberToCommissionExcluded(member);
                            }}
                        />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    @import "../cards/card.css";

    .actions {
        margin-bottom: 16px;
    }

    .fragment {
        padding: 16px;
        user-select: none;
    }

    .commission-card-title {
        display: flex;
        align-items: center;

        user-select: none;
    }

    :global(.commission-card-title > * ~ *) {
        margin-left: 8px;
    }

    .commission-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
    }

    .members-list {
        display: flex;
        flex-direction: column;
    }

    .members-list-item {
        display: flex;
        flex-direction: row;
        align-items: center;

        user-select: none;
    }

    .members-list-item span {
        flex-grow: 1;
    }
</style>
