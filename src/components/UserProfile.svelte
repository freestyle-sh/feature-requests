<script lang="ts">
  import type { UserCS } from "$lib/cloudstate/app";
  import { userStore } from "$lib/stores/user";

  import SignIn from "./SignInButton.svelte";
  import * as Avatar from "./ui/avatar/index";

  export let user:
    | ReturnType<InstanceType<typeof UserCS>["getPersonalInfo"]>
    | undefined = undefined;

  userStore.set({
    user,
  });
</script>

{#if $userStore.user}
  <div class="flex items-center gap-2">
    <Avatar.Root class="h-8 w-8">
      <Avatar.Image src={$userStore.user.image} />
      <Avatar.Fallback>
        {$userStore.user.displayName?.slice(0, 1).toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
    <div>{$userStore.user.displayName}</div>
  </div>
{:else}
  <SignIn>Sign In</SignIn>
{/if}
