import {Environment, Grid, OrbitControls, PerspectiveCamera, Sky} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useWorld} from "koota/react";
import {useEffect, useRef} from "react";
import {DirectionalLight} from "three";
import {schedule} from "../ecs";
import {Ground, PropSpawner} from "./PropSpawner";
import {jobScheduler} from "../misc/job-scheduler";

export function SceneContainer() {
  const world = useWorld();

  useFrame((_state, delta, xrFrame) => {
    // this is how we connect our ecs systems to r3f
    schedule.run({world, delta});

    // the scheduler is not important to the application here, we're just using it
    // to enable some lazy promise functionality in the example actions store. Normally it
    // would be regular ecs system (but the code is old and expects all the
    // r3f state as args) that's why we're calling it here after the main ecs-schedule.
    jobScheduler.__update(_state, delta, xrFrame);
  });


  return (
    <>
      <Ground/>
      <PropSpawner/>

      <Background/>
      <OrbitControls dampingFactor={1}/>
      <PerspectiveCamera makeDefault position={[40, 20, 20]}/>
    </>
  )
}


function Background() {
  const lightRef = useRef<DirectionalLight>(null!);

  useEffect(() => {
    lightRef.current.shadow.camera.left = -60;
    lightRef.current.shadow.camera.right = 60;
    lightRef.current.shadow.camera.top = 60;
    lightRef.current.shadow.camera.bottom = -60;
    lightRef.current.shadow.camera.near = 0.5;
    lightRef.current.shadow.camera.far = 100;
    lightRef.current.shadow.mapSize.width = 1024;
    lightRef.current.shadow.mapSize.height = 1024;
  }, []);


  return (
    <>
      <color attach="background" args={['#060612']}/>

      <directionalLight
        color={"#ffb65e"} intensity={3} position={[20, 40, 5]}
        ref={lightRef}
        castShadow
      />


      <Grid
        position-y={0.02}
        infiniteGrid
        fadeDistance={500}
        fadeStrength={5}
        cellSize={0.6} sectionSize={3}
        sectionColor={'#3d4367'}
        cellColor={'rgb(15,28,145)'}
      />

      <Environment frames={1} environmentIntensity={0.4}>
        <Sky sunPosition={[0, 1, 11]}/>
      </Environment>
    </>
  )
}