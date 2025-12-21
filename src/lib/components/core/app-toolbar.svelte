<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import List, { Graphic, Item, Separator, Text } from "@smui/list";
    import Menu from "@smui/menu";
    import { Anchor } from "@smui/menu-surface";
    import type { Undefinable } from "$lib/utils/types";
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";

    export async function openMenu() {
        if (menu?.isOpen()) return;
        menu?.setOpen(true);
    }

    let menu: Undefinable<Menu> = $state();
    let anchor: Undefinable<HTMLDivElement> = $state();
    let anchorClasses: { [k: string]: boolean } = $state({});

    type ExportType = {
        title?: string;

        prominent?: boolean;
        dense?: boolean;
        secondaryColor?: boolean;

        showGenerateImageButton?: boolean;
        showProfileButton?: boolean;

        logged?: boolean;

        onClickDrawer?: () => void;
        onClickGenerateImage?: () => void;

        onClickMenuLogin?: () => void;
        onClickMenuLogout?: () => void;
        onClickMenuProfile?: () => void;
    };
    let {
        title = "",

        prominent = false,
        dense = false,
        secondaryColor = false,

        showGenerateImageButton = false,
        showProfileButton = false,

        logged = false,

        onClickDrawer = undefined,
        onClickGenerateImage = undefined,

        onClickMenuLogin = undefined,
        onClickMenuLogout = undefined,
        onClickMenuProfile = undefined,
    }: ExportType = $props();
</script>

<TopAppBar
    style="user-select: none;"
    variant="static"
    {prominent}
    {dense}
    color={secondaryColor ? "secondary" : "primary"}
>
    <Row>
        <Section>
            <IconButton
                class="material-symbols-rounded"
                onclick={onClickDrawer}
            >
                menu
            </IconButton>

            <Title>{title}</Title>
        </Section>
        <Section align="end" toolbar>
            {#if showGenerateImageButton}
                <IconButton
                    class="material-symbols-rounded"
                    aria-label=""
                    onclick={onClickGenerateImage}
                >
                    image
                </IconButton>
            {/if}

            {#if showProfileButton}
                <!-- Ancora do menu popup -->
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
                    <!-- Botão do usuário -->
                    <IconButton
                        class="material-symbols-rounded"
                        aria-label=""
                        onclick={openMenu}
                    >
                        account_circle
                    </IconButton>

                    <!-- Menu popup -->
                    <Menu
                        bind:this={menu}
                        anchor={false}
                        anchorElement={anchor}
                        anchorCorner="BOTTOM_LEFT"
                    >
                        <List>
                            {#if logged}
                                <Item onclick={onClickMenuLogin}>
                                    <Graphic class="material-symbols-rounded">
                                        person
                                    </Graphic>
                                    <Text>Perfil</Text>
                                </Item>
                                <Item onclick={onClickMenuLogout}>
                                    <Graphic class="material-symbols-rounded">
                                        logout
                                    </Graphic>
                                    <Text>Logout</Text>
                                </Item>
                            {:else}
                                <Item onclick={onClickMenuLogin}>
                                    <Graphic class="material-symbols-rounded">
                                        login
                                    </Graphic>
                                    <Text>Login</Text>
                                </Item>
                            {/if}
                        </List>
                    </Menu>
                </div>
            {/if}
        </Section>
    </Row>
</TopAppBar>
