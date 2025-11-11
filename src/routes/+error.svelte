<script lang="ts">
    import { page } from "$app/state";
    import NextjsErrorView from "$lib/components/misc/nextjs-error-view.svelte";
</script>

<main>
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src="https://i.ibb.co/WWwWmwFh/isk-image.webp" alt="isk-image" />

    <NextjsErrorView
        style="height: auto; --color: #fff;"
        code={page.status}
        message={page.error?.message}
    />
</main>

<style>
    main {
        height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background: black;
    }

    img {
        width: 320px;
        margin-bottom: 16px;

        user-select: none;
        pointer-events: none;
    }
</style>
