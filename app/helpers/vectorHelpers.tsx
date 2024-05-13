import { Quaternion, Vector3 } from "three";

export function setQuaternionFromDirection({
  startingDirection = new Vector3(0, 0, -1),
  direction
}: {
  startingDirection?: Vector3;
  direction: Vector3;
}) {
  if (!direction) {return;}
  return new Quaternion().setFromUnitVectors(startingDirection, direction);
};
