<script lang="ts">
    import { onMount } from "svelte";
    import Card, { Content } from "@smui/card";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import Menu from "@smui/menu";
    import CharacterDisplayIcon from "../misc/character-display-icon.svelte";
    import CharacterDisplayName from "../misc/character-display-name.svelte";
    import { UserInformation } from "$lib/client/user-information.svelte";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import { CommissionState, Role } from "$lib/common/database/enums";
    import type { Nullable } from "$lib/utils/types";
    import CharacterListItem from "../misc/character-list-item.svelte";

    function comingSoon() {
        alert("Coming soon...");
    }

    onMount(() => {
        for (let index = 0; index < 10; index++) {
            characterList.push({
                id: index.toString(),
                server: 115,
                name: "Testing " + index,
                earnings: 30000,
                power: 1000,
                role: Role.MEMBER,
                offline: 0,

                state: CommissionState.AVAILABLE,
                time: 0,
                missed: 0,

                worldTree: "",
                minesInDungeon: "",
                cloudKingdom: "",
                cassinoOnYacht: "",
                infernoRally: "",
            });
        }
    });

    let menu: Nullable<Menu> = $state(null);
    let characterList: MemberTypeV3[] = $state([]);
</script>

<div class="fragment">
    <div class="content">
        <img class="profile-image" src="/favicon.svg" alt="" />
        <h5>
            {UserInformation.name}
        </h5>

        <Card style="width: 100%;">
            <Content component={List}>
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded">
                        add_photo_alternate
                    </Graphic>
                    <Text>Mudar foto</Text>
                </Item>

                <Separator />
                <Item onclick={comingSoon}>
                    <Graphic class="material-symbols-rounded">person</Graphic>
                    <Text>Associar personagem</Text>
                </Item>
            </Content>
        </Card>

        <Card style="width: 100%; margin-top: 16px;">
            <Content>
                <h5>Personagens</h5>
                <List>
                    {#if characterList.length > 0}
                        {#each characterList as character}
                            <CharacterListItem {character} />
                        {/each}
                    {:else}
                        <Item>
                            <Text>Sem person associado</Text>
                        </Item>
                    {/if}
                </List>
            </Content>
        </Card>
    </div>
</div>

<style>
    .fragment {
        user-select: none;
    }

    .content {
        width: 320px;
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
