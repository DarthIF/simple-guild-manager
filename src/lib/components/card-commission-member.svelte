<script lang="ts">
    import Card, { PrimaryAction } from "@smui/card";
    import { Separator } from "@smui/list";
    import { formatNumberCompact } from "$lib/utils/number-util";
    import type { MemberTypeV3 } from "$lib/common/database/constants-and-types";
    import { CommissionState } from "$lib/common/database/enums";
    import { getAppropriatedString } from "$lib/strings";
    import { fragment_commissions } from "$lib/strings/strings";
    import { getDateOrLastClosedString } from "$lib/client/utils";

    type ExportType = {
        member: MemberTypeV3;
        onClickListener?: (member: MemberTypeV3) => void;
    };
    let { member, onClickListener }: ExportType = $props();
</script>

<Card>
    <PrimaryAction padded onclick={() => onClickListener?.(member)}>
        <div class="header">
            <div class="header-letter">
                {member.name[0] || "?"}
            </div>
            <div class="header-text">
                <span>{member.name}</span>
                <span>
                    {member.power ? formatNumberCompact(member.power) : "?"}
                </span>
            </div>
        </div>
        <Separator />
        <div class="details">
            <div>
                {getAppropriatedString(
                    fragment_commissions.missed,
                    member.missed,
                )}
            </div>
            {#if member.time !== 0}
                <div>
                    {getDateOrLastClosedString(member.state, member.time)}
                </div>
            {/if}
        </div>
    </PrimaryAction>
</Card>

<style>
    .header {
        margin-bottom: 8px;
        display: flex;
    }

    .header > div ~ div {
        margin-left: 8px;
    }

    .header-letter {
        width: 48px;
        height: 48px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: var(--mdc-theme-secondary);
        color: var(--mdc-theme-on-secondary);
        font-size: 1.8rem;
    }

    .header-text {
        display: flex;
        flex-direction: column;
    }

    .details {
        margin-top: 8px;
    }
</style>
