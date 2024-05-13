import { type Ref } from "react";
import { type Group, type Object3DEventMap } from "three";

const debug = false;

export const WheelDebug = ({ radius, wheelRef }: {
  radius: number;
  wheelRef: Ref<Group<Object3DEventMap>>;
}) => {
  return debug && (
    <group position-y={-0.4}>
    <group ref={wheelRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius / 2, radius / 2, 0.515, 8]} />
        <meshNormalMaterial transparent={true} opacity={0.8} />
      </mesh>
    </group>
    </group>
  );
};
