import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export default function createMesh() {
  const loader = new FontLoader();

  return new Promise<THREE.Mesh>((resolve) => {
    loader.load("/t_/helvetiker_regular.typeface.json", (font) => {
      const text = "three.js";

      const geometry = new TextGeometry(text, {
        font: font,
        size: 3, // 大小
        height: 0.2, // 宽度
        curveSegments: 12,
        bevelEnabled: true, // 边扩充
        bevelThickness: 0.15, // 扩充厚度
        bevelSize: 0.3, // 扩充大小
        bevelSegments: 5,
      });

      const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
      const mesh = new THREE.Mesh(geometry, material);

      resolve(mesh);
    });
  });
}
