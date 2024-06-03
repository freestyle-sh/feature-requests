<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import type { FeatureRequestsListCS } from "../cloudstate/feature-requests";
  import Input from "./ui/input/input.svelte";
  import Textarea from "./ui/textarea/textarea.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import SignInButton from "./SignInButton.svelte";

  export let featureRequests: ReturnType<FeatureRequestsListCS["getRequests"]>;

  const featureRequestsCS = useCloud<typeof FeatureRequestsListCS>(
    "feature-requests-list"
  );

  let title = "";
  let description = "";
</script>

<div class="max-w-4xl mx-auto">
  <div class="grid gap-2 my-8">
    <h2 class="text-center font-bold text-lg">Create a new feature request</h2>
    <Input bind:value={title} type="text" placeholder="Title" />
    <Textarea bind:value={description} placeholder="Description" />
    <div class="flex justify-center">
      <SignInButton
        then={() => {
          featureRequestsCS.createRequest(title, description).then((req) => {
            featureRequests = [...featureRequests, req];
          });
        }}
      >
        Submit Feature Request
      </SignInButton>
    </div>
  </div>

  {#each featureRequests as request}
    <div class="border rounded-md py-4 px-6">
      <div class="flex justify-between">
        <div class="font-bold">
          {request.title}
        </div>
        <div class="flex items-center gap-2">
          <Avatar.Root class="h-8 w-8">
            <Avatar.Image src={request.ownerImageUrl} />
            <Avatar.Fallback>
              {request.ownerDisplayName.slice(0, 1)}
            </Avatar.Fallback>
          </Avatar.Root>
          {request.ownerDisplayName}
        </div>
      </div>
      <div>
        {request.description}
      </div>
    </div>
  {/each}
</div>
