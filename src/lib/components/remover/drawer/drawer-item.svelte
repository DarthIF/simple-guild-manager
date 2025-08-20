<script lang="ts">
    import { onMount } from "svelte";
    import MaterialSymbols from "../remover/material-symbols.svelte";

    type DrawerItemType = {
        text: string;
        icon?: string;
        href?: string | undefined;
        onClick?: () => void;
    };

    function onHashchangeListener() {
        if (!el_anchor) return;

        if (href === window.location.hash) {
            el_anchor.classList.add("active");
        } else {
            el_anchor.classList.remove("active");
        }
    }

    onMount(() => {
        window.addEventListener("hashchange", onHashchangeListener);
        onHashchangeListener();
    });

    let el_anchor: HTMLAnchorElement | null = $state(null);
    let { text, icon, href, onClick }: DrawerItemType = $props();
</script>

{#if href}
    <a bind:this={el_anchor} {href} class="drawer-item" onclick={onClick}>
        {#if icon}
            <span class="drawer-item-icon">
                <MaterialSymbols {icon} />
            </span>
        {/if}
        <span>{text}</span>
    </a>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="drawer-item" onclick={onClick}>
        {#if icon}
            <span class="drawer-item-icon">
                <MaterialSymbols {icon} />
            </span>
        {/if}
        <span>{text}</span>
    </div>
{/if}

<style>
    .drawer-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        color: var(--on-surface);
    }

    .drawer-item:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }

    :global(.drawer-item.active) {
        background-color: rgba(98, 0, 238, 0.08);
        color: var(--primary-color);
    }

    .drawer-item-icon {
        margin-right: 32px;
    }
</style>
