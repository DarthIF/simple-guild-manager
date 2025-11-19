<script lang="ts">
    let { name = "name" } = $props();
    let letter = $derived.by(() => {
        return name.trim()[0].toLocaleUpperCase();
    });
</script>

<div class="letter">
    {letter}
</div>

<style>
    .letter {
        width: 36px;
        height: 36px;
        aspect-ratio: 1/1;

        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        background: var(--mdc-theme-secondary);
        color: var(--mdc-theme-on-secondary);

        font-size: 1.2rem;
    }
</style>
