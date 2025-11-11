<script lang="ts">
    import { source } from "sveltekit-sse";
    import { packetDecode } from "$lib/common/packets/utils";
    import { ClientSync } from "$lib/client/client-database.svelte";

    let { token } = $props();

    const sync = source("/app/sync", {
        options: {
            method: "POST",
            headers: {
                session: token,
            },
        },
    }).select("message");

    sync.subscribe((data) => {
        const packet = packetDecode(data);
        if (!packet) {
            console.warn("Received empty data");
            return;
        }

        if (!packet.action) {
            console.warn("Received invalid action");
            return;
        }

        if (packet.data || packet.exported) {
            console.log(`Received data on [${packet.action}]`);

            // @ts-ignore
            ClientSync.syncFromPacket(packet);
            return;
        }

        console.warn("Received invalid data", packet);
    });
</script>
