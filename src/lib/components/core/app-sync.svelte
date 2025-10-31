<script lang="ts">
    import { source } from "sveltekit-sse";
    import { Base64 } from "js-base64";
    import { b64Parser } from "$lib/common/packets/utils";

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
        const packet = b64Parser(data);
        console.log("Received data", packet);
    });
</script>
