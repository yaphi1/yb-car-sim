import { CompoundBodyProps, WheelInfoOptions, useCompoundBody } from "@react-three/cannon";
import { MutableRefObject, useRef } from "react";

export const useWheels = (
  width: number,
  height: number,
  front: number,
  radius: number
) => {
  const wheels: MutableRefObject<null>[] = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const wheelInfo: WheelInfoOptions = {
    radius,
    directionLocal: [0, -1, 0],
    axleLocal: [-1, 0, 0], // this affects which way the wheels spin
    suspensionStiffness: 60,
    suspensionRestLength: 0.1,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    maxSuspensionTravel: 0.1,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
    chassisConnectionPointLocal: [0, 0, 0],
    isFrontWheel: false,
  };

  const wheelInfos: Array<WheelInfoOptions> = [
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, height * -0.3, -(front * 0.7)],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, height * -0.3, -(front * 0.7)],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, height * -0.3, (front * 0.7)],
      isFrontWheel: false,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, height * -0.3, (front * 0.7)],
      isFrontWheel: false,
    },
  ];

  const getCompoundBodyProps = (): CompoundBodyProps => ({
    collisionFilterGroup: 0,
    mass: 1,
    shapes: [
      {
        // @ts-expect-error
        args: [wheelInfo.radius, wheelInfo.radius, 0.2, 16],
        // args: [wheelInfo.radius, wheelInfo.radius, 0.015, 16],
        rotation: [0, 0, -Math.PI / 2],
        type: 'Cylinder',
      },
    ],
    type: 'Kinematic',
  });

  useCompoundBody(getCompoundBodyProps, wheels[0]);
  useCompoundBody(getCompoundBodyProps, wheels[1]);
  useCompoundBody(getCompoundBodyProps, wheels[2]);
  useCompoundBody(getCompoundBodyProps, wheels[3]);

  return [wheels, wheelInfos];
};
