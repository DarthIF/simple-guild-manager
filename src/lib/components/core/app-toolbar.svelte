<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";

    type ToolbarType = {
        title?: string;

        prominent?: boolean;
        dense?: boolean;
        secondaryColor?: boolean;

        showGenerateImageButton?: boolean;
        showProfileButton?: boolean;

        onClickDrawer?: () => void;
        onClickGenerateImage?: () => void;
        onClickProfileButton?: () => void;
    };

    let {
        title = "",

        prominent = false,
        dense = false,
        secondaryColor = false,

        showGenerateImageButton = false,
        showProfileButton = false,

        onClickDrawer = undefined,
        onClickGenerateImage = undefined,
        onClickProfileButton = undefined,
    }: ToolbarType = $props();
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
                <Wrapper>
                    <IconButton
                        class="material-symbols-rounded"
                        aria-label=""
                        onclick={onClickProfileButton}
                    >
                        account_circle
                    </IconButton>
                    <Tooltip>{getAppropriatedString(basic.user)}</Tooltip>
                </Wrapper>
            {/if}
        </Section>
    </Row>
</TopAppBar>
