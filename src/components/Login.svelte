<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import type { FeatureRequestsAppCS } from "../cloudstate/app";
  import {
    handlePasskeyAuthentication,
    handlePasskeyRegistration,
  } from "../cloudstate/auth";

  const auth = useCloud<typeof FeatureRequestsAppCS>("feature-requests-app");
  let username: string;
</script>

<input bind:value={username} type="text" />
<button
  on:click={async () => {
    const options = await auth.startAuthenticationOrRegistration(username);
    if (options.login) {
      const passkey = await handlePasskeyAuthentication(options.login);
      await auth.finishAuthentication(passkey);
    } else if (options.signup) {
      const passkey = await handlePasskeyRegistration(options.signup);
      await auth.finishRegistration(passkey);
    }
  }}
>
  Continue
</button>
