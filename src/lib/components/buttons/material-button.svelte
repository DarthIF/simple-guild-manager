<script lang="ts">
    import { ButtonTypes } from "./button-types";

    type MaterialButtonTypes = {
        type: ButtonTypes;
        style?: string;
        onClick?: () => void;
        children?: any;
    };

    let {
        type,
        style,
        onClick,
        children = undefined,
    }: MaterialButtonTypes = $props();
</script>

<button
    {style}
    class="button"
    class:button-primary={type === ButtonTypes.PRIMARY}
    class:button-secondary={type === ButtonTypes.SECONDARY}
    class:button-danger={type === ButtonTypes.DANGER}
    onclick={onClick}
>
    <!-- Renderizar o elemento filho, equivalente ao <slot/> do Svelte v4 -->
    {@render children?.()}
</button>

<style>
    .button {
        padding: 8px 16px;

        border: none;
        border-radius: 4px;

        /*
        display: inline-flex;
        align-items: center;
        justify-content: center;
        */

        font-size: 1rem;
        cursor: pointer;
    }

    .button-primary {
        background-color: var(--primary-color);
        color: var(--on-primary);
    }

    .button-primary:hover {
        background-color: var(--primary-dark);
    }

    .button-secondary {
        background-color: transparent;
        color: var(--primary-color);
    }

    .button-secondary:hover {
        background-color: rgba(98, 0, 238, 0.08);
    }

    .button-danger {
        background-color: var(--error);
        color: var(--on-error);
    }

    .button-danger:hover {
        background-color: #8c0000;
    }
</style>
