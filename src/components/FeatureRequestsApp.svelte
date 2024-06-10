<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import FeatureRequestList from "./FeatureRequestList.svelte";
  import UserProfile from "./UserProfile.svelte";
  import type { FeatureRequestsListCS } from "$lib/cloudstate/feature-requests";
  import type { FeatureRequestsAppCS } from "$lib/cloudstate/app";

  const queryClient = new QueryClient();

  export let featureRequests: ReturnType<
    InstanceType<typeof FeatureRequestsListCS>["getRequests"]
  >;

  export let user: ReturnType<
    InstanceType<typeof FeatureRequestsAppCS>["getUserInfo"]
  >;
</script>

<QueryClientProvider client={queryClient}>
  <div>
    <div class="border-b h-16 flex justify-between px-4 items-center">
      <div>Freestyle Feature Requests</div>
      <div>
        <UserProfile {user} />
      </div>
    </div>
    <FeatureRequestList {featureRequests} {user} />
  </div>
</QueryClientProvider>
