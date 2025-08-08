<script lang="ts">
    import Textfield from "@smui/textfield";

    export function getValue(): string {
        return value;
    }

    let { style = "", value = $bindable(), variant, label } = $props();
</script>

<Textfield {style} bind:value {variant} {label} />
