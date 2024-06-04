<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import type { FeatureRequestsAppCS, UserCS } from "../cloudstate/app";
  import {
    handlePasskeyAuthentication,
    handlePasskeyRegistration,
  } from "../cloudstate/auth";
  import Button from "./ui/button/button.svelte";
  import Input from "./ui/input/input.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import Label from "./ui/label/label.svelte";
  import { buttonVariants } from "./ui/button";
  import { userStore } from "$lib/stores/user";

  export let or: (() => unknown) | undefined = undefined;
  export let then: (() => unknown) | undefined = undefined;
  export let size: "sm" | "default" | "icon" | "lg" = "default";
  export { className as class };

  const auth = useCloud<typeof FeatureRequestsAppCS>("feature-requests-app");
  let className = "";
  let username: string;
  let displayName: string;

  async function handleLogin() {
    const options = await auth.startAuthenticationOrRegistration(username);
    if ("login" in options) {
      const passkey = await handlePasskeyAuthentication(options.login);
      await auth.finishAuthentication(passkey);
    } else if ("signup" in options) {
      const passkey = await handlePasskeyRegistration(options.signup);
      await auth.finishRegistration(passkey);
    }
    userStore.set({
      user: await auth.getUserInfo(),
    });
    await then?.();
  }

  async function configureProfile() {
    const user = useCloud<typeof UserCS>($userStore.user!.id);
    user.setDisplayName(displayName).then(() => {
      userStore.set({
        user: {
          ...$userStore.user!,
          displayName,
        },
      });
    });
  }
</script>

<div>
  {#if $userStore.user?.displayName}
    <Button class={className} {size} on:click={then || or}>
      <slot />
    </Button>
  {:else}
    <Dialog.Root
      open={$userStore.user && $userStore.user?.displayName === undefined}
    >
      <Dialog.Trigger class={buttonVariants() + className}>
        <slot />
      </Dialog.Trigger>
      <Dialog.Content>
        <div class="grid gap-4">
          {#if $userStore.user}
            <Dialog.Header>
              <Dialog.Title class="text-center">Configure Profile</Dialog.Title>
            </Dialog.Header>
            <Label for="name">Display Name</Label>
            <Input
              placeholder="My Name"
              id="name"
              type="text"
              bind:value={displayName}
            />
            <Dialog.Footer>
              <Button class="w-full" type="submit" on:click={configureProfile}>
                Save Profile
              </Button>
            </Dialog.Footer>
          {:else}
            <Dialog.Header>
              <Dialog.Title class="text-center">Sign In</Dialog.Title>
            </Dialog.Header>
            <Label for="email">Email</Label>
            <Input
              placeholder="my@email.com"
              id="email"
              type="email"
              autocomplete="on"
              bind:value={username}
            />
            <Dialog.Footer>
              <Button class="w-full" type="submit" on:click={handleLogin}>
                Continue with Passkey
              </Button>
            </Dialog.Footer>
          {/if}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</div>
