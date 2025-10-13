<script lang="ts">
    import "$lib/components/css/glitch.css";
</script>

<!-- From Uiverse.io by Smit-Prajapati -->
<!-- https://uiverse.io/Smit-Prajapati/great-bat-98 -->
<a href="https://github.com/DarthIF/simple-guild-manager" target="_blank">
    <div class="shiny-slot shiny-card">
        <div class="card">
            <div
                class="top-section"
                style="background-image: url(https://github.com/DarthIF.png);"
            >
                <div class="border"></div>
                <div class="icons">
                    <div class="logo">Darth IF</div>
                    <div class="social-media"></div>
                </div>
            </div>
            <div class="bottom-section">
                <span class="title glitch" data-glitch="Simple Guild Manager">
                    Simple Guild Manager
                </span>
                <div class="row row1">
                    <div class="item">
                        <span class="big-text">100%</span>
                        <span class="regular-text">Free for use</span>
                    </div>
                    <div class="item">
                        <span class="big-text">100%</span>
                        <span class="regular-text">Functional</span>
                    </div>
                    <div class="item">
                        <span class="big-text">0%</span>
                        <span class="regular-text">Sugar</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</a>

<style>
    a {
        text-decoration: none;
    }

    .card {
        z-index: 1;
        width: 230px;
        position: relative;

        border-radius: 20px;

        background: var(--card-background);
        color: var(--card-color);

        overflow: hidden;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    }

    .top-section {
        height: 150px;
        position: relative;

        border-radius: 16px;

        display: flex;
        flex-direction: column;

        background: linear-gradient(
            45deg,
            rgb(4, 159, 187) 0%,
            rgb(80, 246, 255) 100%
        );
        background-position: center;
        background-size: cover;
    }

    .top-section .border {
        border-bottom-right-radius: 10px;
        height: 32px;
        width: 130px;
        background: white;
        background: var(--card-background);
        position: relative;
        transform: skew(-40deg);
        box-shadow: -10px -10px 0 0 var(--card-background);
    }

    .top-section .border::before {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        right: -16px;
        background: rgba(255, 255, 255, 0);
        border-top-left-radius: 10px;
        box-shadow: -5px -5px 0 2px var(--card-background);
    }

    .top-section::before {
        content: "";
        position: absolute;
        top: 32px;
        left: 0;
        background: rgba(255, 255, 255, 0);
        height: 16px;
        width: 16px;
        border-top-left-radius: 15px;
        box-shadow: -5px -5px 0 2px var(--card-background);
    }

    .top-section .icons {
        position: absolute;
        top: 0;
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: space-between;
    }

    .top-section .icons .logo {
        height: 100%;
        width: 100%;
        margin-left: 16px;
        aspect-ratio: 1;

        display: flex;
        align-items: center;
    }

    .top-section .icons .social-media {
        height: 100%;
        padding: 8px 15px;
        display: flex;
        gap: 7px;
    }

    .bottom-section {
        margin-top: 24px;
    }

    .bottom-section .title {
        display: block;
        font-size: 17px;
        font-weight: bolder;
        color: var(--card-color);
        text-align: center;
        letter-spacing: 2px;
    }

    .bottom-section .row {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
    }

    .bottom-section .row .item {
        flex: 30%;
        text-align: center;
        padding: 5px;
        color: var(--card-color);
    }

    .bottom-section .row .item .big-text {
        font-size: 12px;
        display: block;
    }

    .bottom-section .row .item .regular-text {
        font-size: 9px;
    }

    .bottom-section .row .item:nth-child(2) {
        border-left: 1px solid rgba(255, 255, 255, 0.126);
        border-right: 1px solid rgba(255, 255, 255, 0.126);
    }

    /* BORDA ANIMADA */

    .shiny-card {
        --card-background: var(--mdc-theme-on-primary);
        --card-color: var(--mdc-theme-primary);

        padding: 5px;
        border-radius: 20px;
        background-color: var(--card-background);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .shiny-card:hover {
        transform: scale(1.05);
    }

    @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }

    .shiny-slot {
        position: relative;
    }

    .shiny-slot::after,
    .shiny-slot::before {
        content: "";
        position: absolute;

        height: 100%;
        width: 100%;
        top: 50%;
        left: 50%;
        translate: -50% -50%;

        border-radius: 20px;

        background-image: conic-gradient(
            from var(--angle),
            #ff000000,
            var(--card-color),
            #ff000000,
            #ff000000,
            var(--card-color),
            #ff000000,
            #ff000000
        );

        animation: 3s spin linear infinite;
    }

    .shiny-slot::before {
        filter: blur(1.5rem);
        opacity: 0.5;
    }

    @keyframes spin {
        from {
            --angle: 0deg;
        }

        to {
            --angle: 360deg;
        }
    }
</style>
