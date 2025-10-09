<script lang="ts">
    import { Actions, Content } from "@smui/card";
    import Radio from "@smui/radio";
    import FormField from "@smui/form-field";
    import SmuiSettingsCard from "../smui/cards/smui-settings-card.svelte";
    import { fragment_settings } from "$lib/strings/strings";
    import { SUPPORTED_LANGS } from "$lib/utils/lang-util";
    import { ReactiveSettings, setLanguage } from "$lib/client/settings.svelte";
    import { getAppropriatedString } from "$lib/strings";

    let selectedLang = $state(ReactiveSettings.lang.code);
    $effect(() => {
        for (const lang of SUPPORTED_LANGS) {
            if (lang.code !== selectedLang) continue;

            setLanguage(lang);
        }
    });
</script>

<div class="fragment">
    <SmuiSettingsCard title={fragment_settings.change_lang}>
        <Content>
            {#each SUPPORTED_LANGS as lang}
                <FormField>
                    <Radio bind:group={selectedLang} value={lang.code} touch />
                    {#snippet label()}
                        {lang.name}
                    {/snippet}
                </FormField>
            {/each}
            
            <pre class="">{getAppropriatedString(fragment_settings.current_lang, selectedLang)}</pre>
        </Content>
    </SmuiSettingsCard>
</div>

<style>
    :global(.vertical-radio-group) {
        display: flex;
        flex-direction: column;
    }

    /* Default styles for larger screens (e.g., desktops) */
    .fragment {
        width: 600px;
        margin: auto;
        padding: 16px;
        padding-bottom: 96px;
    }

    /* Styles for tablets */
    @media screen and (max-width: 1023px) {
        .fragment {
            width: 520px;
        }
    }

    /* Styles for smartphones */
    @media screen and (max-width: 767px) {
        .fragment {
            width: auto;
        }
    }
</style>
