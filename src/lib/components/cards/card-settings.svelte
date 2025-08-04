<script lang="ts">
    type CardSettingsType = {
        children?: any;
        title?: string;
    };

    let { title = "", children = undefined }: CardSettingsType = $props();
</script>

<div class="card">
    <h2 class="card-title">{title}</h2>

    <!-- Renderizar o elemento filho, equivalente ao <slot/> do Svelte v4 -->
    {@render children?.()}
</div>

<style>
    @import "./card.css";
</style>
