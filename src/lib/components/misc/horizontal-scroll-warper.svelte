<script lang="ts">
    type ExportType = { class?: string; style?: string; children?: any };

    let { class: className = "", style = "", children }: ExportType = $props();
</script>

<div class={`scroll-warper ${className}`} {style}>
    <div class="scroll-warper-content">
        {@render children?.()}
    </div>
</div>

<style>
    .scroll-warper {
        width: 100%;
        height: auto;

        overflow-x: auto;
        overflow-y: hidden;
    }

    .scroll-warper-content {
        width: max-content;
        height: inherit;

        display: block;
    }
</style>
