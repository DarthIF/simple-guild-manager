<script lang="ts">
    import { source } from "sveltekit-sse";
    import { packetDecode, validatePacket } from "$lib/common/packets/utils";
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
        validatePacket(
            // Decodificar a informação
            packetDecode(data),

            // Pacote Valido
            (packet) => {
                console.log(`Received data on [${packet.action}]`);

                // @ts-ignore
                ClientSync.syncFromPacket(packet);
            },

            // Pacote Invalido
            (message, packet) => console.warn(message, packet),
        );
    });
</script>
