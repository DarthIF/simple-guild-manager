<script lang="ts">
    import Card, { Actions, Content } from "@smui/card";
    import { getAppropriatedString, type LocalizedString } from "$lib/strings";

    type CardSettingsType = {
        title?: LocalizedString | string;
        padded?: boolean;
        children?: any;
    };

    let {
        title = "",
        padded = false,
        children = undefined,
    }: CardSettingsType = $props();
</script>

<Card {padded}>
    <Content>
        <span class="mdc-typography--headline6 card-item-title">
            {getAppropriatedString(title)}
        </span>
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
