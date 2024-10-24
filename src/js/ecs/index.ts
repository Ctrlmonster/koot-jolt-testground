import {Schedule} from "directed";
import {createWorld, World} from "koota";
import {BuildJoltBodies} from "./systems/build-jolt-bodies";
import {UpdateJolt} from "./systems/update-jolt";
import {SyncThreeToJolt} from "./systems/sync-three-to-jolt";

// =================================================================================================================


// create our world
export const world = createWorld();

// create a default schedule (we can control what data it passes into systems)
export const schedule = new Schedule<{ world: World, delta: number }>();

// import all ecs systems and build the schedule
schedule.add(BuildJoltBodies);
schedule.add(UpdateJolt, {after: BuildJoltBodies});
schedule.add(SyncThreeToJolt, {after: UpdateJolt});
schedule.build();


// =================================================================================================================



