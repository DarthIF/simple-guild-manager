<script>
    import { ReactiveData } from "$lib/utils/reactive-database.svelte";
    import CardSettings from "../cards/card-settings.svelte";
    import AuditLogItem from "../list/audit-log-item.svelte";
</script>

<div class="fragment">
    <CardSettings title="Registro de Auditoria">
        <ul class="list" id="auditLogList">
            {#each ReactiveData.auditLog as log}
                <AuditLogItem {log} />
            {/each}
        </ul>
    </CardSettings>
</div>

<style>
    .fragment {
        padding: 16px;
    }
</style>
