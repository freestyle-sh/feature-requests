<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import {
    FeatureRequestCS,
    type FeatureRequestsListCS,
  } from "../cloudstate/feature-requests";
  import Input from "./ui/input/input.svelte";
  import Textarea from "./ui/textarea/textarea.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import SignInButton from "./SignInButton.svelte";
  import Button from "./ui/button/button.svelte";
  import Star from "lucide-svelte/icons/star";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { buttonVariants } from "./ui/button";
  import { EllipsisVerticalIcon } from "lucide-svelte";

  export let featureRequests: ReturnType<FeatureRequestsListCS["getRequests"]>;

  const featureRequestsCS = useCloud<typeof FeatureRequestsListCS>(
    "feature-requests-list"
  );

  const useFeatureRequest = (id: string) =>
    useCloud<typeof FeatureRequestCS>(id);

  let title = "";
  let description = "";
</script>

<div class="max-w-4xl mx-auto">
  <h2 class="text-center font-bold text-lg mt-8">Feature Requests</h2>
  <div class="grid gap-2 my-8 border p-2 rounded-md">
    <Input bind:value={title} type="text" placeholder="Title" />
    <Textarea bind:value={description} placeholder="Description" />
    <div class="flex justify-end">
      <!-- class="max-sm:w-full" -->
      <SignInButton
        size="sm"
        then={() => {
          featureRequestsCS.createRequest(title, description).then((req) => {
            featureRequests = [...featureRequests, req];
            title = "";
            description = "";
          });
        }}
      >
        Submit Request
      </SignInButton>
    </div>
  </div>
  <div class="grid gap-2">
    {#each featureRequests as request}
      <div class="border rounded-md py-4 px-6">
        <div class="flex w-full">
          <div class="w-full">
            <div class="flex justify-between">
              <div class="flex gap-2 items-center">
                <div class="font-bold">
                  {request.title}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {request.description}
        </div>

        <div class="flex justify-between items-center">
          <div class="flex gap-2 mt-2">
            <div class="flex items-center gap-2 text-sm">
              <Avatar.Root class="h-5 w-5">
                <Avatar.Image src={request.ownerImageUrl} />
                {#if request.ownerDisplayName}
                  <Avatar.Fallback>
                    {request.ownerDisplayName?.slice(0, 1).toUpperCase()}
                  </Avatar.Fallback>
                {/if}
              </Avatar.Root>
              {request.ownerDisplayName}
            </div>
            <Button
              variant="ghost"
              size="sm"
              on:click={() => {
                useFeatureRequest(request.id)
                  .upvote()
                  .then((res) => {
                    request.votes = res.votes;
                    request.currentUserVoted = res.currentUserVoted;
                  });
              }}
            >
              <Star
                class="h-4 w-4 mr-2"
                fill={request.currentUserVoted ? "yellow" : "white"}
              />
              <div>
                {request.votes}
              </div>
            </Button>
          </div>
          <div>
            {#if request.isOwner}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  class={buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })}
                >
                  <EllipsisVerticalIcon class="w-4 h-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      on:click={() => {
                        featureRequestsCS.deleteRequest(request.id).then(() => {
                          featureRequests = featureRequests.filter(
                            (req) => req.id !== request.id
                          );
                        });
                      }}
                    >
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
