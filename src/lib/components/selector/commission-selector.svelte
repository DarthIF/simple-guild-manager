<script lang="ts">
    import Button, { Label } from "@smui/button";
    import HorizontalScrollWarper from "../misc/horizontal-scroll-warper.svelte";
    import { CommissionState } from "$lib/common/database/enums";
    import { getCommissionStateString } from "$lib/client/utils";
    import { getAppropriatedString } from "$lib/strings";
    import "./scroll-warper-responsive-margin.css";

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
    class={"scroll-warper-responsive-margin " + className}
    {style}
>
    {@render fakeTab(CommissionState.AVAILABLE)}
    {@render fakeTab(CommissionState.CLOSED)}
    {@render fakeTab(CommissionState.INACTIVE)}
</HorizontalScrollWarper>
