<script lang="ts">
    import { source } from "sveltekit-sse";
    import { packetDecode } from "$lib/common/packets/utils";

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
        console.log("Received data", packet);
    });
</script>
