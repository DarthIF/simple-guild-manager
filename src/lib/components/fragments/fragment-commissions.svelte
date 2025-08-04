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

    onMount(() => {
        availableMembers = Database.listCommissionAvailableMembers();
        closedMembers = Database.listCommissionClosedMembers();
        excludedMembers = Database.listCommissionExcludedMembers();
    });

    let availableMembers: MemberType[] = $state([]);
    let closedMembers: MemberType[] = $state([]);
    let excludedMembers: MemberType[] = $state([]);
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
            <ul>
                {#each availableMembers as member}
                    <li>
                        <span>{member.name}</span>
                        <MaterialIconButton icon="approval_delegation" />
                        <MaterialIconButton icon="group_remove" />
                    </li>
                {/each}
            </ul>
        </div>
        <div class="card">
            <div class="card-title commission-card-title">
                <MaterialSymbols icon="approval_delegation" />
                <span>Fechado</span>
            </div>
            <ul>
                {#each closedMembers as member}
                    <li>{member.name}</li>
                {/each}
            </ul>
        </div>
        <div class="card">
            <div class="card-title commission-card-title">
                <MaterialSymbols icon="group_remove" />
                <span>Excluído</span>
            </div>
            <ul>
                {#each excludedMembers as member}
                    <li>{member.name}</li>
                {/each}
            </ul>
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
</style>
