import { usePlane } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { RepeatWrapping, TextureLoader, Vector2 } from 'three';

export function Ground() {
  const [ref] = usePlane(
    () => ({
      type: 'Static',
      rotation: [-Math.PI / 2, 0, 0]
    }),
    useRef(null)
  );

  const [roughness, normal] = useLoader(TextureLoader, [
    'textures/terrain-roughness.jpg',
    'textures/terrain-normal.jpg',
  ]);

  useEffect(() => {
    [normal, roughness].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(5, 5);
    });
  }, []);

  return (
    <mesh rotation-x={Math.PI * -0.5} castShadow receiveShadow>
      <planeGeometry args={[120, 120]} />

      {/* reflector presets pasted from https://github.com/Domenicobrz/R3F-in-practice/blob/main/car-show/src/Ground.js */}
      <MeshReflectorMaterial
        envMapIntensity={0}
        normalMap={normal}
        normalScale={new Vector2(0.15, 0.15)}
        roughnessMap={roughness}
        dithering={true}
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[1000, 400]} // Blur ground reflections (width, heigt), 0 skips blur
        mixBlur={30} // How much blur mixes with surface roughness (default = 1)
        mixStrength={80} // Strength of the reflections
        mixContrast={1} // Contrast of the reflections
        resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
        depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      />
    </mesh>
  );
}
