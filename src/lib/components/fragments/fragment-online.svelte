<script lang="ts">
    import Card, { Content } from "@smui/card";
    import LayoutResponsiveSingleColumn from "../layouts/layout-responsive-single-column.svelte";
    import { OnlineUsers } from "$lib/client/user.svelte";

    $effect(()=>{

console.log('--> ' , OnlineUsers.list)

    })


</script>

<LayoutResponsiveSingleColumn>
    <div class="fragment-content">
        {#each OnlineUsers.list as user, index}
            {#if index === 0}
                <Card style="width: 100%;">
                    <Content>{user.name}</Content>
                </Card>
            {:else}
                <Card style="width: 100%; margin-top: 16px;">
                    <Content>{user.name}</Content>
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
