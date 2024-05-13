import { Vector3 } from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";
import { setQuaternionFromDirection } from "./helpers/vectorHelpers";
import { useRef } from "react";

const cameraTypes = {
  fixedFollow: 'fixedFollow',
  behind: 'behind',
  free: 'free',
  tower: 'tower',
};

const startingCameraPosition = new Vector3(-0.5, 0, 0.75);

type CarCameraProps = {
  carPosition: Vector3;
  carDirection: Vector3;
};

export function CarCamera({ carPosition, carDirection }: CarCameraProps) {
  const main = useRef(document.querySelector('main'));
  const { cameraType } = useControls({
    cameraType: {
      label: 'Camera',
      options: {
        'Fixed Follow': cameraTypes.fixedFollow,
        'Behind': cameraTypes.behind,
        'Free Cam': cameraTypes.free,
        'Tower': cameraTypes.tower,
      },
      transient: false,
      onChange: () => {
        main.current?.focus();
      },
    },
  });

  return (
    <>
      {cameraType === cameraTypes.free && <OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />}
      {cameraType === cameraTypes.tower && <OrbitControls target={carPosition} maxPolarAngle={1.45} />}
      {cameraType === cameraTypes.fixedFollow && (
        <group
          position={carPosition}
          quaternion={setQuaternionFromDirection({ direction: startingCameraPosition } )}
        >
          <PerspectiveCamera position={[0, 0.5, 6]} makeDefault fov={50} />
        </group>
      )}
      {cameraType === cameraTypes.behind && (
        <group
          position={carPosition}
          quaternion={setQuaternionFromDirection({ direction: carDirection } )}
        >
          <PerspectiveCamera position={[0, 0.5, 6]} makeDefault fov={50} />
        </group>
      )}
    </>
  );
}
