// import { FeatureRequestsAppCS } from "./src/cloudstate/app";
import { defineConfig } from "freestyle-sh";

export default defineConfig({
  dev: {
    initializeCloudstate({ useLocal }) {
      // useLocal(FeatureRequestsAppCS).featureList.createRequest(
      //   "Authentication Package",
      //   "Create a package that allows users to authenticate with their own credentials"
      // );
    },
  },
});
