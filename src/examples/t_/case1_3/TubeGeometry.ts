import * as THREE from "three";

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

export default function createMesh() {
  const path = new CustomSinCurve(3);
  const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);

  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
