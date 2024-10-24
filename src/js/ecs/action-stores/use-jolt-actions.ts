import {createActions} from "koota/react";
import {World} from "koota";
import {JoltWorld, JoltWorldImpl} from "../traits/jolt-world";

export const useJoltActions = createActions((world: World) => ({

    initWorld: (() => {
      let calledOnce = false; // making sure we only call joltInit.default() once – prob not necessary

      // this action returns a promise that could probably be combined with react-suspense for a <Physics> component
      return async () => {
        if (calledOnce || world.has(JoltWorld)) return Promise.resolve();

        calledOnce = true;
        const joltInit = await import("jolt-physics");
        JoltWorldImpl.JOLT_NATIVE = await joltInit.default();
        world.add(JoltWorld)

        console.log("created jolt world");

        return Promise.resolve();
      }
    })()

  }),


  // ... more actions here


);