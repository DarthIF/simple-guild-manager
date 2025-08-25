<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";

    type ToolbarType = {
        title?: string;

        prominent?: boolean;
        dense?: boolean;
        secondaryColor?: boolean;

        showGenerateImageButton?: boolean;

        onClickDrawer?: () => void;
        onClickGenerateImage?: () => void;
    };

    let {
        title = "",

        prominent = false,
        dense = false,
        secondaryColor = false,

        showGenerateImageButton = false,

        onClickDrawer = undefined,
        onClickGenerateImage = undefined,
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
            <IconButton class="material-symbols-rounded" onclick={onClickDrawer}
                >menu
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
        </Section>
    </Row>
</TopAppBar>

<style>
</style>
