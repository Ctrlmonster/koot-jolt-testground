import {trait} from "koota";
import Jolt from "jolt-physics";

export const JoltBody = trait<{
  ref: Jolt.Body;
}>({
  ref: null!,
});