import {Environment, Grid, OrbitControls, PerspectiveCamera, Sky, useHelper} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useWorld} from "koota/react";
import {schedule} from "../ecs";
import {Ground, PropSpawner} from "./PropSpawner";
import {jobScheduler} from "../misc/job-scheduler";
import {useEffect, useRef} from "react";
import {CameraHelper, DirectionalLightHelper} from "three";

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

  const lightRef = useRef();
  const shadowCameraHelperRef = useRef(null);

  // Use the `useHelper` hook to visualize the light and its shadow camera
  useHelper(lightRef, DirectionalLightHelper, 5); // Helper for the light itself
  useHelper(shadowCameraHelperRef, CameraHelper); // Helper for the shadow camera

  useEffect(() => {
    console.log(lightRef.current);




    // set all the left, far, ...
    lightRef.current.shadow.camera.left = -40;
    lightRef.current.shadow.camera.right = 40;
    lightRef.current.shadow.camera.top = 40;
    lightRef.current.shadow.camera.bottom = -40;
    lightRef.current.shadow.camera.near = 0.5;
    lightRef.current.shadow.camera.far = 100;


  }, []);


  return (
    <>
      <color attach="background" args={['#060612']}/>

      <directionalLight
        color={"#ffb65e"} intensity={3} position={[20, 50, 5]}
        ref={lightRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {lightRef.current && (
        <primitive object={lightRef.current.shadow.camera} ref={shadowCameraHelperRef}/>
      )}

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