import {Canvas} from "@react-three/fiber";
import {useQuery} from "koota/react";
import {SceneContainer} from "./SceneContainer";
import {useExampleActions} from "../ecs/action-stores/use-example-actions";
import {JoltBody} from "../ecs/traits/jolt-body";
import {useLayoutEffect, useState} from "react";
import {useJoltActions} from "../ecs/action-stores/use-jolt-actions";


export default function App() {
  const entities = useQuery(JoltBody);
  const {spawnProp} = useExampleActions();
  const {initWorld} = useJoltActions();
  const [joltReady, setJoltReady] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      initWorld()
        .then(() => setJoltReady(true))
        .catch(() => setJoltReady(false));
    })();
  }, []);


  return (
    <div className={"Container text-white"} id={"app"}>
      <Canvas shadows>
        <SceneContainer/>
      </Canvas>

      {
        (!joltReady) ?
          <div
            className={"absolute interaction-none top-0 left-0 w-full h-full text-xl flex justify-center items-center"}>
            Waiting for jolt world...
          </div>
          : null
      }


      <div onClick={spawnProp} className={"absolute btn btn-blue bottom-5 left-5"}>
        Spawn Body!
      </div>

      <div onClick={() => {
      }} style={{display: "none"}} className={"absolute btn btn-red bottom-5 left-60"}>
        Remove Sphere!
      </div>

      <div className={"absolute bottom-20 left-5"} style={{fontSize: "2.5rem"}}>
        Number of Jolt Bodies: {entities.length}
      </div>

    </div>
  )
}


