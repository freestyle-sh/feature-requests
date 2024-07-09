<script lang="ts">
  import type { UserCS } from "$lib/cloudstate/app";
  import { userStore } from "$lib/stores/user";
  import { useCloud } from "freestyle-sh";
  import SignInButton from "./SignInButton.svelte";
  import * as Avatar from "./ui/avatar/index";
  import * as Dialog from "./ui/dialog/index";
  import Input from "./ui/input/input.svelte";
  import CameraIcon from "lucide-svelte/icons/camera";
  import { buttonVariants } from "./ui/button";
  import { useQueryClient } from "@tanstack/svelte-query";
  import type { FeatureRequestsListCS } from "$lib/cloudstate/feature-requests";

  export let user:
    | ReturnType<InstanceType<typeof UserCS>["getPersonalInfo"]>
    | undefined = undefined;

  userStore.set({
    user,
  });

  const client = useQueryClient();
  const app = useCloud<typeof FeatureRequestsListCS>("feature-requests-list");

  async function configureProfile() {
    const u = useCloud<typeof UserCS>($userStore.user!.id);
    u.updateProfile({
      displayName: displayName,
      image: image ? image : undefined,
    }).then((res) => {
      userStore.set({
        user: {
          ...$userStore.user!,
          displayName: res.displayName,
          image: res.image,
        },
      });

      client.invalidateQueries({
        queryKey: [app.getRequests],
        exact: true,
      });
    });
  }

  async function handleSelectImage(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const file = event.currentTarget.files?.[0];
    image = file;
  }

  let displayName = $userStore.user?.displayName ?? "";
  let image: Blob | undefined;
</script>

{#if $userStore.user}
  <Dialog.Root
    open={$userStore.user && $userStore.user?.displayName === undefined}
  >
    <Dialog.Trigger>
      <div class="flex items-center gap-2">
        <Avatar.Root class="h-8 w-8">
          <Avatar.Image src={$userStore.user.image} />
          <Avatar.Fallback>
            {$userStore.user.displayName?.slice(0, 1).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div>{$userStore.user.displayName}</div>
      </div>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title class="text-center">Configure Profile</Dialog.Title>
      </Dialog.Header>
      <div class="flex items-center justify-center">
        <label
          for="image"
          class="stack place-items-center stack cursor-pointer group hover:opacity-80 duration-200 my-16"
        >
          <img
            class="rounded-full h-48 w-48 aspect-square object-cover border"
            src={image ? URL.createObjectURL(image) : $userStore.user.image}
            alt="Profile"
          />
          <CameraIcon
            class="h-8 w-8 text-gray-400 group-hover:opacity-100 opacity-0 duration-200"
          />
        </label>
        <input
          class="hidden"
          type="file"
          id="image"
          on:change={handleSelectImage}
          accept="image/*"
        />
      </div>
      <Input
        placeholder="My Name"
        id="name"
        type="text"
        bind:value={displayName}
      />
      <Dialog.Footer>
        <Dialog.Close
          class={buttonVariants() + " w-full"}
          type="submit"
          on:click={configureProfile}
        >
          Save Profile
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <SignInButton>Sign In</SignInButton>
{/if}
