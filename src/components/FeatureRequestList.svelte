<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import { type FeatureRequestsListCS } from "../cloudstate/feature-requests";
  import FeatureRequest from "./FeatureRequest.svelte";
  import {
    createMutation,
    createQuery,
    useQueryClient,
  } from "@tanstack/svelte-query";
  import { fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import type { FeatureRequestsAppCS } from "$lib/cloudstate/app";
  import FeatureRequestEditor from "./FeatureRequestEditor.svelte";

  export let featureRequests: ReturnType<FeatureRequestsListCS["getRequests"]>;
  export let user: ReturnType<FeatureRequestsAppCS["getUserInfo"]>;

  const featureRequestsCS = useCloud<typeof FeatureRequestsListCS>(
    "feature-requests-list"
  );

  const requestRequestsQuery = createQuery({
    queryKey: [featureRequestsCS.getRequests],
    queryFn: () => featureRequestsCS.getRequests(),
    initialData: featureRequests,
  });

  const app = useCloud<typeof FeatureRequestsAppCS>("feature-requests-app");
  const userQuery = createQuery({
    queryKey: [app.getUserInfo],
    queryFn: () => app.getUserInfo(),
    initialData: user!,
  });

  const client = useQueryClient();
  const addRequestMutation = createMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => featureRequestsCS.createRequest(title, description),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [featureRequestsCS.getRequests],
        exact: true,
      });
    },
  });
</script>

<div class="max-w-4xl mx-auto">
  <h2 class="text-center font-bold text-lg mt-8">Feature Requests</h2>
  <div class="my-8">
    <FeatureRequestEditor
      buttonAction={({ title, description }) => {
        return $addRequestMutation.mutateAsync({
          title,
          description,
        });
      }}
      buttonText="Submit Request"
    />
  </div>
  <div class="grid gap-2">
    {#each $requestRequestsQuery.data as request (request.id)}
      <div
        animate:flip={{
          duration: 300,
        }}
        transition:fade
      >
        <FeatureRequest {request} />
      </div>
    {/each}
    {#if $addRequestMutation.isPending}
      <FeatureRequest
        request={{
          id: crypto.randomUUID(),
          title: $addRequestMutation.variables.title,
          description: $addRequestMutation.variables.description,
          currentUserVoted: true,
          votes: 1,
          isOwner: true,
          ownerDisplayName: $userQuery.data?.displayName,
          ownerImageUrl: $userQuery.data?.image ?? "",
        }}
      />
    {/if}
  </div>
</div>
