<script>
    import { ReactiveData } from "$lib/utils/reactive-database.svelte";
    import Card, { Content } from "@smui/card";
    import { Label, Icon } from "@smui/common";
    import AuditLogItem from "../misc/audit-log-item.svelte";
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";
</script>

<div class="fragment" id="auditLog">
    <Card>
        <Content>
            <div class="card-title">
                <Icon class="material-symbols-rounded">history</Icon>
                <h6>{getAppropriatedString(basic.audit_log)}</h6>
            </div>
            <ul class="list" id="auditLogList">
                {#each ReactiveData.auditLog as log}
                    <li class="item">
                        <AuditLogItem {log} />
                    </li>
                {/each}
            </ul>
        </Content>
    </Card>
</div>

<style>
    .fragment {
        padding: 16px;
    }

    .card-title {
        padding-top: 16px;
        padding-left: 16px;
        padding-bottom: 8px;

        display: flex;
        align-items: center;
    }

    .card-title > h6 {
        margin-left: 8px;
    }

    .list {
    }

    .item {
        padding: 12px 16px;

        border-bottom: 1px solid #eee;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .item:last-child {
        padding-bottom: 0;
        border-bottom: none;
    }
</style>
