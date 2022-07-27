import type { Ref } from "vue";
import { ref } from "vue";

export const modes = [
  "normal",
  "selected",
  "create",
  "resize",
  "write",
  "connect_from",
  "connect_to",
] as const;

export type Mode = typeof modes[number];

const mode: Ref<Mode> = ref("normal");

export function useMode() {
  return { mode };
}
