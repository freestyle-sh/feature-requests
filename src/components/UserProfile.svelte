<script lang="ts">
  import type { UserCS } from "$lib/cloudstate/app";
  import { userStore } from "$lib/stores/user";

  import SignIn from "./SignInButton.svelte";

  export let user:
    | ReturnType<InstanceType<typeof UserCS>["getInfo"]>
    | undefined = undefined;

  userStore.set({
    user,
  });
</script>

{#if $userStore.user}
  <div>{$userStore.user.username}</div>
{:else}
  <SignIn>Sign In</SignIn>
{/if}
