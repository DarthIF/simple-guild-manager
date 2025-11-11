<script lang="ts">
    import { getAppropriatedString } from "$lib/strings";
    import { input_file } from "$lib/strings/strings";

    type ExportType = {
        id: string;
        icon: string;
        accept: string;
        files?: FileList | null;
    };
    let { id, icon, accept, files = $bindable(null) }: ExportType = $props();

    let selectedFile: File | null = $derived.by(() => {
        if (!files) return null;
        return files.item(0);
    });
</script>

<label for={id} class="custom-file-upload">
    <span class="material-symbols-rounded">{icon}</span>
    {#if selectedFile}
        <span class="file-name">{selectedFile.name}</span>
    {:else}
        <span>{getAppropriatedString(input_file.select_file)}</span>
    {/if}
</label>
<input type="file" {id} {accept} bind:files />
{#if selectedFile}
    <div>
        {getAppropriatedString(
            input_file.file_size,
            (selectedFile.size / 1024).toFixed(2),
        )}
    </div>
{/if}

<style>
    input[type="file"] {
        display: none;
    }

    .custom-file-upload {
        padding: 8px 12px;
        display: flex;

        border: 1px solid var(--mdc-theme-text-icon-on-background);
        border-radius: 8px;

        cursor: pointer;
    }

    .custom-file-upload span + span {
        margin-left: 8px;
    }

    .file-name {
        word-break: break-all;
    }
</style>
