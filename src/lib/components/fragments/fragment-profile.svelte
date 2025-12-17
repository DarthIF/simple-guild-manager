<script lang="ts">
    import { onMount } from "svelte";
    import Card, { Content } from "@smui/card";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import IconButton, { Icon } from "@smui/icon-button";
    import CharacterListItem from "../misc/character-list-item.svelte";
    import { UserInformation } from "$lib/client/user-information.svelte";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import { CommissionState, Role } from "$lib/common/database/enums";
    import LayoutResponsiveSingleColumn from "../layouts/layout-responsive-single-column.svelte";

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

    let characterList: MemberTypeV3[] = $state([]);
</script>

<LayoutResponsiveSingleColumn>
    <div class="fragment-content">
        <Card style="width: 100%;">
            <Content class="profile-card-content">
                <img
                    class="profile-image"
                    src="/favicon.svg"
                    alt={UserInformation.icon}
                />

                <div class="profile-card-details">
                    <h5>
                        {UserInformation.name}
                    </h5>

                    <div class="profile-card-buttons">
                        <Wrapper>
                            <IconButton onclick={comingSoon}>
                                <Icon class="material-symbols-rounded">
                                    add_photo_alternate
                                </Icon>
                            </IconButton>
                            <Tooltip unbounded>Mudar foto</Tooltip>
                        </Wrapper>

                        <Wrapper>
                            <IconButton onclick={comingSoon}>
                                <Icon class="material-symbols-rounded">
                                    person
                                </Icon>
                            </IconButton>
                            <Tooltip unbounded>Associar personagem</Tooltip>
                        </Wrapper>
                    </div>
                </div>
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

    :global(.profile-card-content) {
        display: flex;
        flex-direction: row;
    }

    .profile-image {
        width: 120px;
        height: 120px;

        border-radius: 50%;

        background: var(--mdc-theme-secondary);
        object-fit: cover;
    }

    .profile-card-details {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .profile-card-buttons {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: end;
        flex-grow: 1;
    }

    .profile-card-details h5 {
        margin-left: 1rem;
    }
</style>
