<script lang="ts">
    import CardAbout from "../card-about.svelte";
</script>

<div class="fragment">
    <div class="page">
        <CardAbout />
    </div>

    <div class="footer">
        <span>Simple Guild Manager | Version: 0.0.1</span>
        <span>Created with 💚💛💙</span>
    </div>
</div>

<style>
    .fragment {
        width: 100%;
        height: 100%;
    }

    .page {
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .footer {
        padding-top: 28px;
        padding-bottom: 28px;
        padding-left: 28px;

        display: flex;
        flex-direction: column;

        background: var(--mdc-theme-surface);
        color: var(--mdc-theme-on-surface);

        user-select: none;

        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
        -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
        -moz-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.19);
    }

    .footer > span:nth-child(1) {
        font-size: larger;
    }
</style>
