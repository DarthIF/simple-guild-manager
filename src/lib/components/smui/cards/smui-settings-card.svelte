<script lang="ts">
    import Card, { Actions, Content } from "@smui/card";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";

    type CardSettingsType = {
        title?: LocalizedString;
        padded?: boolean;
        children?: any;
    };

    let {
        title = { en: "", pt: "" },
        padded = false,
        children = undefined,
    }: CardSettingsType = $props();
</script>

<Card padded={padded}>
    <Content>
        <h2 class="mdc-typography--headline6 card-item-title">
            {getAppropriatedString(title)}
        </h2>
    </Content>

    <!-- Renderizar o elemento filho, equivalente ao <slot/> do Svelte v4 -->
    {@render children?.()}
</Card>

<style>
    .card-item-title {
        font-size: 1.25rem;
        user-select: none;
    }
</style>
