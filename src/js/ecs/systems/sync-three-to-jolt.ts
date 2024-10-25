import {World} from "koota";
import {JoltBody} from "../traits/jolt-body";
import {JoltWorld} from "../traits/jolt-world";
import {MeshRef} from "../traits/mesh-ref";

export const SyncThreeToJolt = ({world}: { world: World }) => {
  if (!world.has(JoltWorld)) return;


  // we use the low-level useStores api each (instead of updateEach) for max perf
  world.query(JoltBody, MeshRef).useStores(([joltBody, meshRef], entities) => {

    for (const entity of entities) {
      const eIdx = entity.id();

      const body = joltBody[eIdx];
      const mesh = meshRef[eIdx];

      const pos = body.GetPosition();
      mesh.position.set(pos.GetX(), pos.GetY(), pos.GetZ());

      const rot = body.GetRotation();
      mesh.quaternion.set(rot.GetX(), rot.GetY(), rot.GetZ(), rot.GetW());
    }
  });

}