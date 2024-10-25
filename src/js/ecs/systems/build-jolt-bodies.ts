import {World} from "koota";
import {NeedsJoltBody} from "../traits/needs-jolt-body";
import {MeshRef} from "../traits/mesh-ref";
import {
  createShapeFromGeometry,
  inferInitTransformsFromMesh,
  inferShapeArgsFromBaseGeometry
} from "../../misc/jolt-helper";

import {JoltWorld, JoltWorldImpl, LAYER_MOVING, LAYER_NON_MOVING} from "../traits/jolt-world";
import {JoltBody} from "../traits/jolt-body";
import Jolt from "jolt-physics";


export const BuildJoltBodies = ({world}: { world: World }) => {

  // we just store the jolt world directly on the ecs world
  if (!world.has(JoltWorld)) return;

  const joltWorld = world.get(JoltWorld);
  const Jolt = JoltWorldImpl.JOLT_NATIVE;

  // query all meshes that want a jolt body
  world.query(NeedsJoltBody, MeshRef).updateEach(([buildSettings, mesh], entity) => {
    const {buildConvexShape, layer, motionType, continuousCollisionMode} = buildSettings;

    let shape: Jolt.Shape;
    if (buildConvexShape) {
      shape = createShapeFromGeometry(mesh.geometry);
    } else {
      const {shape: ShapeClass, args} = inferShapeArgsFromBaseGeometry(mesh.geometry);
      // @ts-ignore
      shape = new ShapeClass(...args);
    }

    const {pos, rot} = inferInitTransformsFromMesh(mesh);

    const layerConstant = (layer === "moving") ? LAYER_MOVING : LAYER_NON_MOVING;
    const motionTypeConstant = (() => {
      switch (motionType) {
        case "dynamic":
          return Jolt.EMotionType_Dynamic;
        case "static":
          return Jolt.EMotionType_Static;
        case "kinematic":
          return Jolt.EMotionType_Kinematic;
        default:
          throw new Error(`unrecognized motion type: ${motionType}`);
      }
    })();


    const creationSettings = new Jolt.BodyCreationSettings(shape, pos, rot, motionTypeConstant, layerConstant);
    // consume settings to create a body
    const body = joltWorld.bodyInterface.CreateBody(creationSettings);
    Jolt.destroy(creationSettings);

    // check if we wanted continuous collisions on this body
    if (continuousCollisionMode) {
      joltWorld.bodyInterface.SetMotionQuality(body.GetID(), Jolt.EMotionQuality_LinearCast)
    }

    // add body to the jolt world
    joltWorld.bodyInterface.AddBody(body.GetID(), Jolt.EActivation_Activate);


    // update the entity (remove the flag, add the body trait)
    entity.remove(NeedsJoltBody);
    entity.add(JoltBody(body));
  });

}