import {useQuery} from "koota/react";
import {IsRandomProp} from "../ecs/traits/is-random-prop";
import {Entity} from "koota";
import {memo, useEffect, useMemo, useRef} from "react";
import {Mesh} from "three";
import {MeshRef} from "../ecs/traits/mesh-ref";
import {NeedsJoltBody} from "../ecs/traits/needs-jolt-body";
import {world} from "../ecs";

export function PropSpawner() {
  const sceneProps = useQuery(IsRandomProp);

  return (
    <group>
      {sceneProps.map((entity: Entity) =>
        <SceneProp key={entity} entity={entity}/>)
      }
    </group>
  )
}


const SceneProp = memo(function SceneProp({entity}: { entity: Entity }) {
  const meshRef = useRef<Mesh>(null!);
  const geometry = useMemo(() => Math.random() < 0.5 ? <boxGeometry/> : <sphereGeometry/>, [entity]);
  const color = useMemo(() => `hsl(${Math.random() * 360}, 100%, 50%)`, [entity])

  useEffect(() => {
    entity.add(MeshRef(meshRef.current));
    entity.add(NeedsJoltBody);
    return () => {
      entity.remove(MeshRef);
      entity.remove(NeedsJoltBody);
    }
  }, [entity]);

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 25, 0]}>
      {geometry}
      <meshStandardMaterial color={color}/>
    </mesh>
  )
});

export function Ground() {
  const meshRef = useRef<Mesh>(null!);

  useEffect(() => {
    const entity = world.spawn(
      MeshRef(meshRef.current),
      NeedsJoltBody({continuousCollisionMode: true, layer: "non_moving", motionType: "static"})
    );
    return () => {
      entity.destroy();
    }
  }, []);

  return (
      <mesh ref={meshRef} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[96, 96]}/>
        <meshPhongMaterial color={"gold"}/>
      </mesh>
  )
}