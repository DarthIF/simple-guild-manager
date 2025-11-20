<script lang="ts">
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import Menu from "@smui/menu";
    import { Anchor } from "@smui/menu-surface";
    import CharacterDisplayIcon from "./character-display-icon.svelte";
    import CharacterDisplayName from "./character-display-name.svelte";

    function comingSoon() {
        alert("Coming soon...");
    }

    let menu: Menu;
    let anchor: HTMLDivElement | undefined = $state();
    let anchorClasses: { [k: string]: boolean } = $state({});

    type ExportTypes = { character: MemberTypeV3 };
    let { character }: ExportTypes = $props();
</script>

<div
    class={Object.keys(anchorClasses).join(" ")}
    use:Anchor={{
        addClass: (className) => {
            if (!anchorClasses[className]) {
                anchorClasses[className] = true;
            }
        },
        removeClass: (className) => {
            if (anchorClasses[className]) {
                delete anchorClasses[className];
            }
        },
    }}
    bind:this={anchor}
>
    <Item
        onclick={() => {
            menu.setOpen(!menu.isOpen());
        }}
    >
        <Graphic>
            <CharacterDisplayIcon name={character.name} />
        </Graphic>
        <Text>
            <CharacterDisplayName
                server={character.server}
                tag="TAG"
                name={character.name}
            />
        </Text>
    </Item>
    <Menu
        bind:this={menu}
        anchor={false}
        anchorElement={anchor}
        anchorCorner="BOTTOM_LEFT"
    >
        <List>
            <Item onclick={comingSoon}>
                <Graphic class="material-symbols-rounded">swords</Graphic>
                <Text>Atualizar poder</Text>
            </Item>
            <Item onclick={comingSoon}>
                <Graphic class="material-symbols-rounded">
                    currency_bitcoin
                </Graphic>
                <Text>Atualizar ganhos</Text>
            </Item>

            <Separator />
            <Item onclick={comingSoon}>
                <Graphic class="material-symbols-rounded">groups</Graphic>
                <Text>Definir membros de time</Text>
            </Item>
        </List>
    </Menu>
</div>
