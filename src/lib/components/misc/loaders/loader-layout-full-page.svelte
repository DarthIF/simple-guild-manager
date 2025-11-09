<script lang="ts">
    import "$lib/components/css/glass.css";
    import LoaderAnimatedText from "./loader-animated-text.svelte";

    let { enable = $bindable(true) } = $props();
</script>

{#if enable}
    <div class="loader-view fill">
        <div class="loader-background glass-background"></div>
        <div class="loader-content fill">
            <LoaderAnimatedText />
        </div>
    </div>
{/if}

<style>
    .loader-view {
        z-index: 9999;
        position: fixed;

        overflow: hidden;
        user-select: none;
    }

    .loader-background {
        width: 100%;
        height: 100%;
    }

    .loader-content {
        z-index: 1;
        position: absolute;

        display: flex;
        justify-content: center;
        align-items: center;

        color: var(--mdc-theme-background);
        font-size: 48pt;
        -webkit-text-stroke: 2px var(--mdc-theme-text-primary-on-background);
    }

    .fill {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
