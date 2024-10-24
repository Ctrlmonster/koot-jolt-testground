import {World} from "koota";
import {JoltWorld} from "../traits/jolt-world";

export const UpdateJolt = ({world, delta}: { world: World, delta: number }) => {
  if (!world.has(JoltWorld)) return;
  const joltWorld = world.get(JoltWorld)?.ref;
  if (!joltWorld) return;

  joltWorld.stepPhysics(delta);
}