import {trait} from "koota";

export const NeedsJoltBody = trait<{
  layer: "moving" | "non_moving",
  motionType: "dynamic" | "static" | "kinematic",
  buildConvexShape: boolean,
  continuousCollisionMode: boolean,
}>({

  // the best defaults here are arguable

  layer: "moving",
  motionType: "dynamic",
  buildConvexShape: false,
  continuousCollisionMode: false,
});