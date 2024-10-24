import {Canvas} from "@react-three/fiber";
import {useQuery} from "koota/react";
import {SceneContainer} from "./SceneContainer";
import {useExampleActions} from "../ecs/action-stores/use-example-actions";
import {JoltBody} from "../ecs/traits/jolt-body";
import {useEffect, useLayoutEffect} from "react";
import {useJoltActions} from "../ecs/action-stores/use-jolt-actions";




export default function App() {
  const entities = useQuery(JoltBody);
  const {spawnProp} = useExampleActions();
  const {initWorld} = useJoltActions();

  useLayoutEffect(() => {
    initWorld();
  }, []);


  return (
    <div className={"Container text-white"} id={"app"}>
      <Canvas shadows>
        <SceneContainer/>
      </Canvas>

      <div onClick={spawnProp} className={"absolute btn btn-blue bottom-5 left-5"}>
        Spawn Body!
      </div>

      <div onClick={() => {}} className={"absolute btn btn-red bottom-5 left-60"}>
        Remove Sphere!
      </div>

      <div className={"absolute bottom-20 left-5"} style={{fontSize: "2.5rem"}}>
        Number of Jolt Bodies: {entities.length}
      </div>

    </div>
  )
}


