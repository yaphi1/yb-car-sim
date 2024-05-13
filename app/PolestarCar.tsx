/*
First, polestar_custom.glb file was compressed with the following:
  gltf-transform resize polestar_modified_full.glb polestar_custom.glb --width 1024 --height 1024
  (55.54 MB) → (17.58 MB)

  gltf-transform webp polestar_custom.glb polestar_custom.glb
  (17.58 MB) → (4.97 MB)

  gltf-transform draco polestar_custom.glb polestar_custom.glb
  (4.97 MB) → (1.22 MB)
---- 
Then, JSX was auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 polestar_custom.glb --types
----
Finally, this file was heavily manually modified to integrate with physics
*/

import * as THREE from 'three'
import React, { RefObject, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { GroupProps, useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Brake_disc_Brake_Disc_0: THREE.Mesh
    Brake_disc001_Brake_Disc_0: THREE.Mesh
    Brake_disc002_Brake_Disc_0: THREE.Mesh
    Brake_disc003_Brake_Disc_0: THREE.Mesh
    Logo_Plane_Logo_Plane_0: THREE.Mesh
    Brembo_Calipers_Brembo_Calipers_0: THREE.Mesh
    Logo_Plane002_Logo_Plane_0: THREE.Mesh
    Brembo_Calipers001_Brembo_Calipers_0: THREE.Mesh
    Logo_Plane001_Logo_Plane_0: THREE.Mesh
    Brembo_Calipers002_Brembo_Calipers_0: THREE.Mesh
    Logo_Plane003_Logo_Plane_0: THREE.Mesh
    Brembo_Calipers003_Brembo_Calipers_0: THREE.Mesh
    Pirelli_P_Zero_Tire_Pirelli_P_Zero_Tire_0: THREE.Mesh
    Pirelli_P_Zero_Tire001_Pirelli_P_Zero_Tire_0: THREE.Mesh
    Pirelli_P_Zero_Tire002_Pirelli_P_Zero_Tire_0: THREE.Mesh
    Pirelli_P_Zero_Tire003_Pirelli_P_Zero_Tire_0: THREE.Mesh
    Polestar1_Rim_Chrome002_Polestar1_Rim_Chrome_0: THREE.Mesh
    Polestar1_Rim_Chrome001_Polestar1_Rim_Chrome_0: THREE.Mesh
    Polestar1_Rim_Chrome003_Polestar1_Rim_Chrome_0: THREE.Mesh
    Polestar1_Rim_Chrome004_Polestar1_Rim_Chrome_0: THREE.Mesh
    Polestar_1_Polestar1_Blackout_0: THREE.Mesh
    Polestar_1_Polestar_1_Car_Paint_0: THREE.Mesh
    Polestar_1_Polestar_1_Chrome_0: THREE.Mesh
    Polestar_1_Polestar_1_Lamps_0: THREE.Mesh
    Polestar_1_Polestar_1_Plastic_0: THREE.Mesh
    Polestar_1_Polestar_1_Reflector_Red_0: THREE.Mesh
    Polestar_1_Polestar_1_Reflector_White_0: THREE.Mesh
    Polestar_1_Polestar_1_Reverse_Light_0: THREE.Mesh
    Polestar_1_Polestar_1_Side_View_Mirror_0: THREE.Mesh
    Polestar_1_Polestar_1_Windows_0: THREE.Mesh
    Polestar_1_Polestar_1_Windows_Red_Glass_0: THREE.Mesh
    Polestar_1_Polestar_1_Windows_White_Glass_0: THREE.Mesh
  }
  materials: {
    Brake_Disc: THREE.MeshStandardMaterial
    Logo_Plane: THREE.MeshStandardMaterial
    Brembo_Calipers: THREE.MeshPhysicalMaterial
    Pirelli_P_Zero_Tire: THREE.MeshStandardMaterial
    Polestar1_Rim_Chrome: THREE.MeshStandardMaterial
    Polestar1_Blackout: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
    Polestar_1_Chrome: THREE.MeshStandardMaterial
    Polestar_1_Lamps: THREE.MeshStandardMaterial
    Polestar_1_Plastic: THREE.MeshStandardMaterial
    Polestar_1_Reflector_Red: THREE.MeshStandardMaterial
    Polestar_1_Reflector_White: THREE.MeshStandardMaterial
    Polestar_1_Reverse_Light: THREE.MeshStandardMaterial
    Polestar_1_Side_View_Mirror: THREE.MeshStandardMaterial
    Polestar_1_Windows: THREE.MeshStandardMaterial
    Polestar_1_Windows_Red_Glass: THREE.MeshPhysicalMaterial
    Polestar_1_Windows_White_Glass: THREE.MeshPhysicalMaterial
  }
}

function getDirectionFromWheels(wheelRefs: Array<RefObject<THREE.Group<THREE.Object3DEventMap>>>) {
  if (!wheelRefs?.[1]?.current) {
    return;
  }
  const a = (new THREE.Vector3()).subVectors(
    wheelRefs?.[3]?.current?.getWorldPosition(new THREE.Vector3()) as THREE.Vector3Like,
    wheelRefs?.[1]?.current?.getWorldPosition(new THREE.Vector3()) as THREE.Vector3Like,
  );
  const b = (new THREE.Vector3()).subVectors(
    wheelRefs?.[3]?.current?.getWorldPosition(new THREE.Vector3()) as THREE.Vector3Like,
    wheelRefs?.[2]?.current?.getWorldPosition(new THREE.Vector3()) as THREE.Vector3Like,
  );
  const crossVectors = (new THREE.Vector3()).crossVectors(a, b);

  return {
    directionToLookAt: a,
    up: crossVectors,
  };
}

/**
 * The wheels don't bounce like the chassis, so
 * we can use their orientation to get a stable
 * read on where the car is pointed. We can then
 * copy that direction to orient other things.
 * @param wheelRefs The wheels from which to copy the direction
 * @param objectToOrient The object we want to orient
 */
function orientObjectTheSameWayAsCar(
  wheelRefs: Array<RefObject<THREE.Group<THREE.Object3DEventMap>>>,
  objectToOrient: React.RefObject<THREE.Group<THREE.Object3DEventMap>>,
) {
  const directionOfWheels = getDirectionFromWheels(wheelRefs);
  const directionAndObjectExist = directionOfWheels && objectToOrient?.current;

  if (directionAndObjectExist) {
    objectToOrient.current.up = directionOfWheels.up;
    const targetToLookAt = (new THREE.Vector3()).addVectors(
      objectToOrient.current.position,
      directionOfWheels.directionToLookAt
    );
    objectToOrient.current.lookAt(targetToLookAt);
  }
}

export function PolestarCar({
  color = 0x5500aa,
  speed = 0,
  chassisBodyRef,
  carRenderPosition,
  carRotation = new THREE.Vector3(0, 0, 0),
  horizontalDirection,
  steeringValue = 0,
  wheelRefs,
  ...props
} : {
  color?: THREE.ColorRepresentation;
  speed?: number;
  chassisBodyRef?: RefObject<THREE.Group<THREE.Object3DEventMap>>;
  wheelRefs: Array<RefObject<THREE.Group<THREE.Object3DEventMap>>>;
  carRenderPosition?: THREE.Vector3;
  position?: THREE.Vector3;
  carRotation?: THREE.Vector3;
  horizontalDirection: THREE.Vector3;
  steeringValue?: number;
} & GroupProps) {
  const { nodes, materials } = useGLTF('/models/polestar_modified/polestar_custom.glb') as GLTFResult;
  const calipersRef: React.Ref<THREE.Group<THREE.Object3DEventMap>> | undefined = useRef(null);

  useFrame(() => {
    orientObjectTheSameWayAsCar(wheelRefs, calipersRef);
  });

  const { position } = props;
  const chassisRenderHeight = chassisBodyRef ? -1 : 0;
  const chassisRenderRotation = chassisBodyRef ? -Math.PI : 0;

  const carPaint = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 1,
      roughness: 0.1,
    });
  }, []);

  return (
    <>
      <group ref={chassisBodyRef} {...props} dispose={null}>
        <group>
          <group
            name="carBody"
            rotation={[-Math.PI / 2, 0, chassisRenderRotation]}
            position={[0, chassisRenderHeight, 0]}
          >
            <mesh geometry={nodes.Polestar_1_Polestar1_Blackout_0.geometry} material={materials.Polestar1_Blackout} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Car_Paint_0.geometry} material={carPaint} material-color={color} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Chrome_0.geometry} material={materials.Polestar_1_Chrome} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Lamps_0.geometry} material={materials.Polestar_1_Lamps} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Plastic_0.geometry} material={materials.Polestar_1_Plastic} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Reflector_Red_0.geometry} material={materials.Polestar_1_Reflector_Red} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Reflector_White_0.geometry} material={materials.Polestar_1_Reflector_White} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Reverse_Light_0.geometry} material={materials.Polestar_1_Reverse_Light} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Side_View_Mirror_0.geometry} material={materials.Polestar_1_Side_View_Mirror} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Windows_0.geometry} material={materials.Polestar_1_Windows} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Windows_Red_Glass_0.geometry} material={materials.Polestar_1_Windows_Red_Glass} />
            <mesh geometry={nodes.Polestar_1_Polestar_1_Windows_White_Glass_0.geometry} material={materials.Polestar_1_Windows_White_Glass} />
          </group>
        </group>
      </group>





      
      
      <group name="wheelFrontLeft" position-y={-0.35}>
        <group ref={wheelRefs?.[0]}>
          <group scale={0.01} position-x={0.1}>
            <mesh geometry={nodes.Brake_disc002_Brake_Disc_0.geometry} material={materials.Brake_Disc} rotation={[0, 0, Math.PI]} scale={8.135} />
            <mesh geometry={nodes.Pirelli_P_Zero_Tire002_Pirelli_P_Zero_Tire_0.geometry} material={materials.Pirelli_P_Zero_Tire} scale={46.815} />
            <mesh geometry={nodes.Polestar1_Rim_Chrome003_Polestar1_Rim_Chrome_0.geometry} material={materials.Polestar1_Rim_Chrome} rotation={[0, 0, Math.PI]} scale={105.847} />
          </group>
        </group>
      </group>

      <group name="wheelFrontRight" position-y={-0.35}>
        <group ref={wheelRefs?.[1]}>
          <group scale={0.01} position-x={-0.1}>
            <mesh geometry={nodes.Brake_disc_Brake_Disc_0.geometry} material={materials.Brake_Disc} scale={8.135} />
            <mesh geometry={nodes.Pirelli_P_Zero_Tire_Pirelli_P_Zero_Tire_0.geometry} material={materials.Pirelli_P_Zero_Tire} scale={46.815} />
            <mesh geometry={nodes.Polestar1_Rim_Chrome002_Polestar1_Rim_Chrome_0.geometry} material={materials.Polestar1_Rim_Chrome} scale={105.847} />
          </group>
        </group>
      </group>

      <group name="wheelBackLeft" position-y={-0.35}>
        <group ref={wheelRefs?.[2]}>
          <group scale={0.01} position-x={0.1}>
            <mesh geometry={nodes.Brake_disc003_Brake_Disc_0.geometry} material={materials.Brake_Disc} rotation={[0, 0, Math.PI]} scale={8.135} />
            <mesh geometry={nodes.Pirelli_P_Zero_Tire003_Pirelli_P_Zero_Tire_0.geometry} material={materials.Pirelli_P_Zero_Tire} rotation={[0, 0, Math.PI]} scale={46.815} />
            <mesh geometry={nodes.Polestar1_Rim_Chrome004_Polestar1_Rim_Chrome_0.geometry} material={materials.Polestar1_Rim_Chrome} rotation={[0, 0, Math.PI]} scale={105.847} />
          </group>
        </group>
      </group>

      <group name="wheelBackRight" position-y={-0.35}>
        <group ref={wheelRefs?.[3]}>
          <group scale={0.01} position-x={-0.1}>
            <mesh geometry={nodes.Brake_disc001_Brake_Disc_0.geometry} material={materials.Brake_Disc} scale={8.135} />
            <mesh geometry={nodes.Pirelli_P_Zero_Tire001_Pirelli_P_Zero_Tire_0.geometry} material={materials.Pirelli_P_Zero_Tire} scale={46.815} />
            <mesh geometry={nodes.Polestar1_Rim_Chrome001_Polestar1_Rim_Chrome_0.geometry} material={materials.Polestar1_Rim_Chrome} scale={105.847} />
          </group>
        </group>
      </group>





      <group ref={calipersRef} name="calipers" position={position}>

        <group name="calipersFrontLeftContainer" position={[-0.9, -0.658, -1.372]} rotation={[0, steeringValue, 0]}>
          <group name="calipersFrontLeft" position={[0.089, 0, 0]}>
            <group rotation={[Math.PI * 1.3, 0, 0]} scale={0.08135}>
              <mesh geometry={nodes.Brembo_Calipers002_Brembo_Calipers_0.geometry} material={materials.Brembo_Calipers} />
              <mesh geometry={nodes.Logo_Plane001_Logo_Plane_0.geometry} material={materials.Logo_Plane} position={[-1.7, 0, 0]} />
            </group>
          </group>
        </group>

        <group name="calipersFrontRightContainer" position={[0.9, -0.658, -1.372]} rotation={[0, steeringValue, 0]}>
          <group name="calipersFrontRight" position={[-0.089, 0, 0]}>
            <group rotation={[Math.PI * 1.3, 0, 0]} scale={0.08135}>
              <mesh geometry={nodes.Brembo_Calipers_Brembo_Calipers_0.geometry} material={materials.Brembo_Calipers} />
              <mesh geometry={nodes.Logo_Plane_Logo_Plane_0.geometry} material={materials.Logo_Plane} position={[-0.004, 0, 0]} />
            </group>
          </group>
        </group>

        <group name="calipersBackLeft" position={[-0.811, -0.658, 1.37]}>
          <mesh geometry={nodes.Brembo_Calipers003_Brembo_Calipers_0.geometry} material={materials.Brembo_Calipers} rotation={[Math.PI * 1.3, 0, 0]} scale={0.08135} />
        </group>
        <group name="calipersBackRight" position={[0.811, -0.658, 1.37]}>
          <mesh geometry={nodes.Brembo_Calipers001_Brembo_Calipers_0.geometry} material={materials.Brembo_Calipers} rotation={[Math.PI * 1.3, 0, 0]} scale={0.08135} />
        </group>

      </group>

    </>
  )
}

useGLTF.preload('/models/polestar_modified/polestar_custom.glb');
