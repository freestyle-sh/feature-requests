<script lang="ts">
  import SignInButton from "./SignInButton.svelte";
  import Button from "./ui/button/button.svelte";
  import Input from "./ui/input/input.svelte";
  import Textarea from "./ui/textarea/textarea.svelte";

  export let buttonText: string;
  export let buttonAction: (options: {
    title: string;
    description: string;
  }) => Promise<unknown>;

  export let title: string = "";
  export let description: string = "";

  export let loading: boolean | undefined = undefined;

  export let cancelAction: (() => void) | undefined = undefined;
</script>

<div class="grid gap-2 border p-2 rounded-md">
  <Input
    class="font-bold"
    bind:value={title}
    type="text"
    placeholder="Title"
    disabled={loading}
  />
  <Textarea
    bind:value={description}
    placeholder="Description"
    disabled={loading}
  />
  <div class="flex justify-end gap-2">
    {#if cancelAction}
      <Button
        on:click={cancelAction}
        variant="secondary"
        size="sm"
        disabled={loading}>Cancel</Button
      >
    {/if}
    <SignInButton
      {loading}
      size="sm"
      then={() => {
        buttonAction({ title, description }).then(() => {
          title = "";
          description = "";
        });
      }}
    >
      {buttonText}
    </SignInButton>
  </div>
</div>
