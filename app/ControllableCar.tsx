import { ColorRepresentation, Group, MathUtils, Mesh, Object3DEventMap, Quaternion, Vector3 } from "three";
import { PolestarGenerated } from "./PolestarGenerated";
import { useKeyboardControls } from "@react-three/drei";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { WheelInfoOptions, useBox, useRaycastVehicle } from "@react-three/cannon";
import { useWheels } from "./useWheels";
import { WheelDebug } from "./WheelDebug";
import { CarCamera } from "./CarCamera";
import { PolestarCar } from "./PolestarCar";

const carRenderPosition: Vector3 = new Vector3(0, 0, 0);
const maxSteeringAngle = 0.35;

export function ControllableCar({ color = 0x5500aa, startingPosition = new Vector3(0, 0, 0) }: 
{
  color?: ColorRepresentation;
  startingPosition?: Vector3;
}) {
  const [speed, setSpeed] = useState(0);
  const [position, setPosition] = useState(startingPosition);
  const [rotation, setRotation] = useState<Vector3>();
  const [horizontalDirection, setHorizontalDirection] = useState(new Vector3(0, 0, -1));
  const [steeringValue, setSteeringValue] = useState(0);
  const forwardPressed = useKeyboardControls(state => state.forward);
  const backwardPressed = useKeyboardControls(state => state.backward);
  const leftPressed = useKeyboardControls(state => state.left);
  const rightPressed = useKeyboardControls(state => state.right);
  const brakePressed = useKeyboardControls(state => state.brake);
  const isAntiLockBrakeClamped = useRef(false);

  const width = 1.8;
  const height = 0.85;
  const front = 1.96;
  const wheelRadius = 0.7;

  const chassisBodyArgs: [number, number, number] = [width, height, front * 2];
  const [chassisBody, chassisApi] = useBox(
    () => ({
      args: chassisBodyArgs,
      mass: 150,
      position: [startingPosition.x, startingPosition.y, startingPosition.z],
    }),
    useRef<Group>(null)
  );

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius) as [
    Array<RefObject<Group<Object3DEventMap>>>,
    Array<WheelInfoOptions>
  ];

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef<Group>(null)
  );

  const setAcceleration = useCallback(({ force }: { force: number; }) => {
    vehicleApi.applyEngineForce(force, 2);
    vehicleApi.applyEngineForce(force, 3);
  }, [vehicleApi]);

  const setBrake = useCallback(({ force }: { force: number; }) => {
    vehicleApi.setBrake(force, 2);
    vehicleApi.setBrake(force, 3);
  }, [vehicleApi]);

  const updateSteering = useCallback((nextSteeringValue: number) => {
    vehicleApi.setSteeringValue(nextSteeringValue, 0);
    vehicleApi.setSteeringValue(nextSteeringValue, 1);
    setSteeringValue(nextSteeringValue);
  }, [setSteeringValue, vehicleApi]);

  useFrame(() => {
    let targetSteeringValue = 0;
    if (leftPressed && !rightPressed) {
      targetSteeringValue = MathUtils.lerp(steeringValue, maxSteeringAngle, 0.2);
    } else if (rightPressed && !leftPressed) {
      targetSteeringValue = MathUtils.lerp(steeringValue, -maxSteeringAngle, 0.2);
    } else {
      targetSteeringValue = MathUtils.lerp(steeringValue, 0, 0.2);
    }
    updateSteering(targetSteeringValue);

    if (brakePressed) {
      isAntiLockBrakeClamped.current = !isAntiLockBrakeClamped.current;
      const brakeForce = isAntiLockBrakeClamped.current ? 10 : 0;
      setBrake({ force: brakeForce });
    }
  });

  useEffect(() => {
    if (forwardPressed && !backwardPressed) {
      setBrake({ force: 0 });
      setAcceleration({ force: 500 });
    }
    if (backwardPressed && !forwardPressed) {
      setBrake({ force: 0 });
      setAcceleration({ force: -500 });
    }
    if (!forwardPressed && !backwardPressed) {
      setAcceleration({ force: 0 });
    }
    if (!brakePressed) {
      const isNotAccelerating = !forwardPressed && !backwardPressed;
      const shouldCarRest = speed < 0.5 && isNotAccelerating;
      if (shouldCarRest) {
        isAntiLockBrakeClamped.current = true;
        setBrake({ force: 10 });
      } else {
        isAntiLockBrakeClamped.current = false;
        setBrake({ force: 0 });
      }
    }
  }, [setAcceleration, setBrake, forwardPressed, backwardPressed, brakePressed]);

  useEffect(() => {
    chassisApi.velocity.subscribe((velocity) => {
      const speed = new Vector3(...velocity).length();
      setSpeed(speed);
    });

    chassisApi.position.subscribe((position) => {
      const positionVector = new Vector3(...position);
      setPosition(positionVector);
    });
    
    chassisApi.rotation.subscribe((rotation) => {
      const rotationVector = new Vector3(...rotation);
      setRotation(rotationVector);
    });

    chassisApi.quaternion.subscribe((quaternion) => {
      // To get direction from quatnerion:
      // "just rotate your initial forward direction around the current rotation axis"
      // https://www.gamedev.net/forums/topic/56471-extracting-direction-vectors-from-quaternion/
      const updatedDirection = new Vector3().copy(horizontalDirection);
      updatedDirection.applyQuaternion(new Quaternion(...quaternion));
      updatedDirection.y = 0;
      setHorizontalDirection(updatedDirection);
    });
  }, [chassisApi]);

  return (
    <>
      <CarCamera carPosition={position} carDirection={horizontalDirection} />

      <group ref={vehicle} name="vehicle">

        {/* <mesh ref={chassisBody}>
          <meshStandardMaterial />
          <boxGeometry args={chassisBodyArgs} />
        </mesh> */}

        {/* <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
        <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
        <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
        <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} /> */}

        <group>
          <PolestarCar
            color={color}
            speed={speed}
            carRenderPosition={carRenderPosition}
            carRotation={rotation}
            horizontalDirection={horizontalDirection}
            steeringValue={steeringValue}
            position={position}
            chassisBodyRef={chassisBody}
            rotation-y={Math.PI}
            wheelRefs={wheels}
          />
        </group>
      </group>
    </>
  );
}
