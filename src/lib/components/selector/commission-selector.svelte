<script lang="ts">
    import Button, { Label } from "@smui/button";
    import HorizontalScrollWarper from "../misc/horizontal-scroll-warper.svelte";
    import { CommissionState } from "$lib/common/database/enums";
    import { getCommissionStateString } from "$lib/client/utils";
    import { getAppropriatedString } from "$lib/strings";

    function getVariant(target: CommissionState) {
        // Selecionado
        if (selected === target) {
            return "unelevated";
        }

        // Não selecionado
        return "outlined";
    }

    function handleClick(state: CommissionState) {
        if (selected === state) return;
        selected = state;
    }

    type ExportType = {
        class?: string;
        style?: string;
        selected?: CommissionState;
    };
    let {
        class: className = "",
        style = "",
        selected = $bindable(),
    }: ExportType = $props();
</script>

<!-- Modelo dos botões -->
{#snippet fakeTab(state: CommissionState)}
    <Button variant={getVariant(state)} onclick={() => handleClick(state)}>
        <Label>{getAppropriatedString(getCommissionStateString(state))}</Label>
    </Button>
{/snippet}

<HorizontalScrollWarper
    class={className + " fragment-commissions-scroll-warper"}
    {style}
>
    {@render fakeTab(CommissionState.AVAILABLE)}
    {@render fakeTab(CommissionState.CLOSED)}
    {@render fakeTab(CommissionState.INACTIVE)}
</HorizontalScrollWarper>

<style>
    @media (max-width: 599px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-phone, 16px);
            padding-left: var(--mdc-layout-grid-margin-phone, 16px);
        }
    }

    @media (min-width: 600px) and (max-width: 839px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-tablet, 16px);
            padding-left: var(--mdc-layout-grid-margin-tablet, 16px);
        }
    }

    @media (min-width: 840px) {
        :global(.fragment-commissions-scroll-warper) {
            padding-top: var(--mdc-layout-grid-margin-desktop, 24px);
            padding-left: var(--mdc-layout-grid-margin-desktop, 24px);
        }
    }
</style>
