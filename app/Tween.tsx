import { useFrame } from '@react-three/fiber';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';

export function Tween() {
  useFrame(() => {
    TWEEN.update();
  });

  return null;
}
