<script lang="ts">
    import Card, { Content } from "@smui/card";
    import LayoutResponsiveSingleColumn from "../layouts/layout-responsive-single-column.svelte";

    let onlineUsers = ["user 1", "user 2", "user 3"];
</script>

<LayoutResponsiveSingleColumn>
    <div class="fragment-content">
        {#each onlineUsers as user, index}
            {#if index === 0}
                <Card style="width: 100%;">
                    <Content>{user}</Content>
                </Card>
            {:else}
                <Card style="width: 100%; margin-top: 16px;">
                    <Content>{user}</Content>
                </Card>
            {/if}
        {/each}
    </div>
</LayoutResponsiveSingleColumn>

<style>
    .fragment-content {
        width: 100%;
        height: auto;
        padding: 2rem 0;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
