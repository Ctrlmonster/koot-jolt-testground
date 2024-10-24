import {createActions} from "koota/react";
import {World} from "koota";
import {IsRandomProp} from "../traits/is-random-prop";
import {JoltBody} from "../traits/jolt-body";
import {JoltWorld, JoltWorldImpl} from "../traits/jolt-world";
import {sleepUntil} from "../../misc/job-scheduler";

export const useExampleActions = createActions((world: World) => ({

  addRandomImpulse: (entity) => {
    if (!entity.has(JoltBody)) {
      console.warn("tried to add random impulse to entity without a jolt body");
      return;
    }

    // add a random impulse to the body
    const mag = 50000;
    const {bodyInterface} = world.get(JoltWorld).ref;

    bodyInterface.AddImpulse(
      entity.get(JoltBody).ref.GetID(),
      new JoltWorldImpl.JOLT_NATIVE.Vec3(
        Math.random() * mag - mag / 2,
        Math.random() * mag / 2,
        Math.random() * mag - mag / 2
      )
    );

    const mag2 = 5000;
    bodyInterface.AddAngularImpulse(
      entity.get(JoltBody).ref.GetID(),
      new JoltWorldImpl.JOLT_NATIVE.Vec3(
        Math.random() * mag2 - mag2 / 2,
        Math.random() * mag2 - mag2 / 2,
        Math.random() * mag2 - mag2 / 2
      )
    )
  },


  spawnProp: async () => {
    if (!world.has(JoltWorld)) return;

    const entity = world.spawn(IsRandomProp);

    // as soon as the jolt body system has done its job
    // and added a body to the entity (this will take at least one
    // frame, but we don't know for sure)
    await sleepUntil(() => entity.has(JoltBody));

    // we apply a random impulse
    useExampleActions.get(world).addRandomImpulse(entity);
  }

}))