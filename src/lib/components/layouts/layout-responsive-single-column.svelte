<script lang="ts">
    let { children } = $props();
</script>

<div class="layout-responsive">
    {@render children?.()}
</div>

<style>
    /* Default styles for larger screens (e.g., desktops) */
    .layout-responsive {
        width: 600px;
        margin: auto;
        padding: 16px;
        padding-bottom: 96px;
    }

    /* Styles for tablets */
    @media screen and (max-width: 1023px) {
        .layout-responsive {
            width: 520px;
        }
    }

    /* Styles for smartphones */
    @media screen and (max-width: 767px) {
        .layout-responsive {
            width: auto;
        }
    }
</style>
