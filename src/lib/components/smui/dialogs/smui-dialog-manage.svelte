<script lang="ts">
    import Dialog, { Title, Content } from "@smui/dialog";
    import List, {
        Item,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
        Graphic,
    } from "@smui/list";
    import IconButton from "@smui/icon-button";
    import { getAppropriatedString } from "$lib/strings";
    import { basic } from "$lib/strings/strings";

    export async function open() {
        visible = true;
    }

    export function close() {
        visible = false;
    }

    let visible: boolean = $state(false);

    type ExportType = {
        onClickAddMember?: () => void;
        onClickSync?: () => void;
    };
    let {
        onClickAddMember = $bindable(undefined),
        onClickSync = $bindable(undefined),
    }: ExportType = $props();
</script>

<Dialog bind:open={visible} style="user-select: none;">
    <Title>
        {getAppropriatedString(basic.members)}

        <IconButton
            class="material-symbols-rounded"
            style="opacity: 0; pointer-events: none;"
            action="close"
        >
            close
        </IconButton>
    </Title>
    <Content>
        <List>
            <Item onclick={onClickAddMember}>
                <Graphic class="material-symbols-rounded">person_add</Graphic>
                <Text>Adicionar membro</Text>
            </Item>
            <Item onclick={onClickSync}>
                <Graphic class="material-symbols-rounded">sync</Graphic>
                <Text>Sincronizar info dump</Text>
            </Item>
        </List>
    </Content>
</Dialog>
