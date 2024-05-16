<script lang="ts">
  import { useCloud } from "freestyle-sh";
  import type { FeatureRequestsListCS } from "../cloudstate/feature-requests";

  export let featureRequests: ReturnType<FeatureRequestsListCS["getRequests"]>;
  const featureRequestsCS = useCloud<typeof FeatureRequestsListCS>(
    "feature-requests-list"
  );

  let title = "";
  let description = "";
</script>

<div>
  <h2>Create a new feature request</h2>
  <input bind:value={title} type="text" placeholder="Title" />
  <textarea bind:value={description} placeholder="Description"></textarea>
  <button
    on:click={() => {
      featureRequestsCS.createRequest(title, description);
    }}
  >
    Submit
  </button>
</div>
<div>
  {#each featureRequests as request}
    <div>
      <div>
        {request.title}
      </div>
      <div>
        {request.description}
      </div>
    </div>
  {/each}
</div>
