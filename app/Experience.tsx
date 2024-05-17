import { Suspense } from "react";
import { Canvas } from '@react-three/fiber';
import { Environment, KeyboardControls, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Ground } from "./Ground";
import { ControllableCar } from "./ControllableCar";
import { Debug, Physics } from "@react-three/cannon";
import { Vector3 } from "three";
import { useColors } from "./useColors";
import { useControls } from "leva";

function CarShow() {
  const carColor = useColors();

  return (
    <>
      <Environment preset="sunset" />

      <color args={[0, 0, 0]} attach="background" />

      <spotLight
        color={[1, 1, 1]}
        position={[0, 30, 0]}
        intensity={5000}
        angle={Math.PI * 0.35}
      />

      <spotLight
        color={[1, 0.25, 0.7]}
        // color={[1, 1, 1]}
        position={[5, 5, 0]}
        // intensity={150}
        intensity={1000}
        angle={0.6}
        penumbra={0.5}
        castShadow
        shadow-bias={-0.0001}
      />

      <spotLight
        color={[0.14, 0.5, 1]}
        // color={[1, 1, 1]}
        position={[-5, 5, 0]}
        // intensity={200}
        intensity={1500}
        angle={0.6}
        penumbra={0.5}
        castShadow
        shadow-bias={-0.0001}
      />

      <Ground />

      <ControllableCar color={carColor} startingPosition={new Vector3(-0.5, 1, 0)} />
    </>
  );
}

export function Experience() {
  useControls(
    'Controls',
    {
      'Move': {
        value: 'Arrows or w/a/s/d',
        editable: false,
      },
      'Brake': {
        value: '"b" or space',
        editable: false,
      },
    },
  );

  const map = [
    { name: 'forward', keys: ['w', 'ArrowUp'] },
    { name: 'backward', keys: ['s', 'ArrowDown'] },
    { name: 'left', keys: ['a', 'ArrowLeft'] },
    { name: 'right', keys: ['d', 'ArrowRight'] },
    { name: 'brake', keys: ['b', ' '] },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <Physics
            broadphase="SAP"
            defaultContactMaterial={{
              contactEquationStiffness: 10000,
            }}
          >
            {/* <Debug color="white" scale={1.1}> */}
              <CarShow />
            {/* </Debug> */}
          </Physics>
        </Canvas>
      </KeyboardControls>
    </Suspense>
  );
}
