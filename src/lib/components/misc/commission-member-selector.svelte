<script lang="ts">
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import type { Nullable } from "$lib/utils/types";
    import Select, { Option } from "@smui/select";
    import IconButton from "@smui/icon-button";

    type ExportType = {
        label: string;
        value: Nullable<MemberTypeV3>;
        members: MemberTypeV3[];
    };
    let {
        label,
        value = $bindable(),
        members = $bindable(),
    }: ExportType = $props();

    let selected_id: Nullable<string> = $state(null);
    $effect(() => {
        const find = members.find((v) => v.id === selected_id);
        value = find ? find : null;
    });
</script>

<div>
    <Select bind:value={selected_id} {label}>
        {#each members as member}
            <Option value={member.id}>{member.name}</Option>
        {/each}
    </Select>
    <IconButton
        class="material-symbols-rounded"
        onclick={() => {
            value = null;
        }}
    >
        backspace
    </IconButton>
</div>
<pre class="status">Selected: {value?.name}</pre>

<style>
    div {
        display: flex;
        align-items: center;
    }
</style>
