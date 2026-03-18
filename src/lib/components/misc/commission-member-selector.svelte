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
</script>

<div>
    <Select bind:value {label}>
        {#each members as member}
            <Option value={member }>{member.name}</Option>
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
