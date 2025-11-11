<script lang="ts">
    import Card, { Content } from "@smui/card";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import { UserInformation } from "$lib/client/user-information.svelte";

    function comingSoon() {
        alert("Coming soon...");
    }
</script>

<div class="fragment">
    <div class="content">
        <img class="profile-image" src="/favicon.svg" alt="" />
        <h5>
            {UserInformation.name}
        </h5>

        <Card>
            <Content component={List}>
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded"
                        >add_photo_alternate</Graphic
                    >
                    <Text>Mudar foto</Text>
                </Item>

                <Separator />
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded">person</Graphic>
                    <Text>Associar personagem</Text>
                </Item>
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded">swords</Graphic>
                    <Text>Atualizar poder</Text>
                </Item>
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded"
                        >currency_bitcoin</Graphic
                    >
                    <Text>Atualizar ganhos</Text>
                </Item>

                <Separator />
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded">groups</Graphic>
                    <Text>Definir membros de time</Text>
                </Item>
            </Content>
        </Card>
    </div>
</div>

<style>
    .fragment {
        user-select: none;
    }

    .content {
        height: auto;
        padding: 2rem 0;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: var(--mdc-theme-secondary);
        object-fit: cover;
    }
    .profile-image + h5 {
        margin-top: 0.5rem;
        margin-bottom: 1rem;
    }
</style>
