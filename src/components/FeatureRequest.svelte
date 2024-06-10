<script lang="ts">
  import {
    FeatureRequestCS,
    FeatureRequestsListCS,
  } from "$lib/cloudstate/feature-requests";
  import { EllipsisVerticalIcon, StarIcon } from "lucide-svelte";
  import AvatarFallback from "./ui/avatar/avatar-fallback.svelte";
  import AvatarImage from "./ui/avatar/avatar-image.svelte";
  import Avatar from "./ui/avatar/avatar.svelte";
  import Button from "./ui/button/button.svelte";
  import { useCloud } from "freestyle-sh";
  import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";
  import DropdownMenuContent from "./ui/dropdown-menu/dropdown-menu-content.svelte";
  import DropdownMenuItem from "./ui/dropdown-menu/dropdown-menu-item.svelte";
  import { buttonVariants } from "./ui/button";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import FeatureRequestEditor from "./FeatureRequestEditor.svelte";

  export let request: ReturnType<
    InstanceType<typeof FeatureRequestCS>["getInfo"]
  >;

  const featureRequest = useCloud<typeof FeatureRequestCS>(request.id);
  const list = useCloud<typeof FeatureRequestsListCS>("feature-requests-list");

  const client = useQueryClient();
  const deleteRequestMutation = createMutation({
    mutationFn: () => list.deleteRequest(request.id),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [list.getRequests],
        exact: true,
      });
    },
  });

  const updateRequestMutation = createMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) =>
      featureRequest.update({
        title,
        description,
      }),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [list.getRequests],
        exact: true,
      });
      isEditing = false;
    },
  });

  let isEditing = false;
</script>

{#if isEditing}
  <div>
    <FeatureRequestEditor
      buttonAction={({ title, description }) => {
        return $updateRequestMutation.mutateAsync({ title, description });
      }}
      cancelAction={() => {
        isEditing = false;
      }}
      loading={$updateRequestMutation.isPending}
      buttonText="Save"
      description={request.description}
      title={request.title}
    />
  </div>
{:else}
  <div class="border rounded-md py-4 px-6 bg-background">
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
          <Avatar class="h-5 w-5">
            <AvatarImage src={request.ownerImageUrl} />
            {#if request.ownerDisplayName}
              <AvatarFallback>
                {request.ownerDisplayName?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            {/if}
          </Avatar>
          {request.ownerDisplayName ?? "Unknown"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          on:click={() => {
            featureRequest.upvote().then((res) => {
              request.votes = res.votes;
              request.currentUserVoted = res.currentUserVoted;
            });
          }}
        >
          <StarIcon
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
          <DropdownMenu>
            <DropdownMenuTrigger
              class={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <EllipsisVerticalIcon class="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  on:click={() => $deleteRequestMutation.mutate()}
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  on:click={() => {
                    isEditing = true;
                  }}>Edit</DropdownMenuItem
                >
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        {/if}
      </div>
    </div>
  </div>
{/if}
