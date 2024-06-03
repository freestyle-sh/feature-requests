import type { UserCS } from "$lib/cloudstate/app";
import { writable } from "svelte/store";

export const userStore = writable<{
  user: ReturnType<InstanceType<typeof UserCS>["getInfo"]> | undefined;
}>({
  user: undefined,
});
