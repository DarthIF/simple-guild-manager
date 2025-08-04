<script lang="ts">
    import { onMount } from "svelte";
    import {
        Actions,
        Database,
        type AuditLogType,
    } from "$lib/utils/reactive-database.svelte";

    type AuditLogItemType = {
        log: AuditLogType;
    };

    onMount(() => {
        time = new Date(log.timestamp).toLocaleString();

        if (log.action === Actions.CHANGE_ORGANIZATION_NAME) {
            details = `Nome da organização alterado de "${log.details.oldName}" para "${log.details.newName}"`;
        } else if (log.action === Actions.ADD_MEMBER) {
            details = `Membro adicionado: ${log.details.name} (Poder: ${log.details.power})`;
        } else if (log.action === Actions.REMOVE_MEMBER) {
            details = `Membro removido: ${log.details.name}`;
        } else if (log.action === Actions.CREATE_TEAM) {
            details = `Equipe criada: ${log.details.name}`;
        } else if (log.action === Actions.DELETE_TEAM) {
            details = `Equipe removida: ${log.details.name}`;
        } else if (log.action === Actions.ADD_MEMBER_TO_TEAM) {
            const member = Database.findMember(log.details.memberId);
            details = `Membro ${member ? member.name : "Desconhecido"} adicionado à equipe ${log.details.teamName}`;
        } else if (log.action === Actions.REMOVE_MEMBER_FROM_TEAM) {
            const member = Database.findMember(log.details.memberId);
            details = `Membro ${member ? member.name : "Desconhecido"} removido da equipe ${log.details.teamName}`;
        }
    });

    let time = $state("");
    let details = $state("");
    let { log }: AuditLogItemType = $props();
</script>

<li class="list-item">
    <div><strong>{time}</strong></div>
    <div>{details}</div>
</li>

<style>
    @import "./list.css";
</style>
