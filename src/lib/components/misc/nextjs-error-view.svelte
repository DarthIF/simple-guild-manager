<script lang="ts">
    type ExportType = {
        code?: number | string;
        message?: string;
        style?: string;
    };

    let {
        code = 404,
        message = "This is not the page you are looking for.",
        style = "",
    }: ExportType = $props();
</script>

<div class="error" {style}>
    <h1>{code}</h1>
    <h2>{message}</h2>
</div>

<style>
    .error {
        --color: black;

        height: 100vh;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        color: var(--color);
        text-align: center;
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
            "Apple Color Emoji", "Segoe UI Emoji";

        user-select: none;
    }

    .error h1 {
        margin: 0 20px 0 0;
        padding-right: 23px;

        display: inline-block;

        border-right: 2px solid var(--color);

        font-size: 24pt;
        font-weight: 500;
        line-height: 48pt;
        vertical-align: top;
    }

    .error h2 {
        font-size: 14pt;
        font-weight: 400;

        line-height: 28pt;
    }
</style>
