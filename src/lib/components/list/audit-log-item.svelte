<script lang="ts">
    import { onMount } from "svelte";
    import {
        Actions,
        Database,
        type AuditLogType,
    } from "$lib/utils/reactive-database.svelte";
    import { auditToString } from "$lib/utils/audit-log-stringfy";

    type AuditLogItemType = {
        log: AuditLogType;
    };

    onMount(() => {
        time = new Date(log.timestamp).toLocaleString();
        details = auditToString(log);
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
