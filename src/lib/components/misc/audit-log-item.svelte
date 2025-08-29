<script lang="ts">
    import { type AuditLogType } from "$lib/utils/reactive-database.svelte";
    import { auditToString } from "$lib/utils/audit-log-stringify";

    type AuditLogItemType = {
        log: AuditLogType;
    };

    let time = $derived.by(() => new Date(log.timestamp).toLocaleString());
    let details = $derived.by(() => auditToString(log));
    let { log }: AuditLogItemType = $props();
</script>

<div><strong>{time}</strong></div>
<div>{details}</div>

<style>
</style>
