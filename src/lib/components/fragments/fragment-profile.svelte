<script lang="ts">
    import Card, { Content } from "@smui/card";
    import LayoutGrid, { Cell } from "@smui/layout-grid";
</script>

<div class="fragment">
    <LayoutGrid>
        <Cell spanDevices={{ desktop: 4, tablet: 4, phone: 4 }}>
            <div class="left">
                <Card>
                    <img class="profile-image" src="/favicon.svg" alt="" />
                    <Content></Content>
                </Card>
            </div>
        </Cell>
        <Cell spanDevices={{ desktop: 8, tablet: 4, phone: 4 }}>
            <div class="right">
                <Card></Card>
            </div>
        </Cell>
    </LayoutGrid>
</div>

<style>
    .fragment {
    }

    .left {
        flex-grow: 1;
        background: aquamarine;
    }

    .profile-image {
        width: 120px;
        height: 120px;
        object-fit: cover;
    }

    .right {
        background: cadetblue;
    }
</style>
