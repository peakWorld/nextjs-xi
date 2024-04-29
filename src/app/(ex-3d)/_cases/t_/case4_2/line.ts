import * as THREE from "three";

const controlPoints: [number, number, number][] = [
  [1.118281, 5.115846, -3.681386],
  [3.948875, 5.115846, -3.641834],
  [3.960072, 5.115846, -0.240352],
  [3.985447, 5.115846, 4.585005],
  [-3.793631, 5.115846, 4.585006],
  [-3.826839, 5.115846, -14.7362],
  [-14.542292, 5.115846, -14.765865],
  [-14.520929, 5.115846, -3.627002],
  [-5.452815, 5.115846, -3.634418],
  [-5.467251, 5.115846, 4.549161],
  [-13.266233, 5.115846, 4.567083],
  [-13.250067, 5.115846, -13.499271],
  [4.081842, 5.115846, -13.435463],
  [4.125436, 5.115846, -5.334928],
  [-14.521364, 5.115846, -5.239871],
  [-14.510466, 5.115846, 5.486727],
  [5.745666, 5.115846, 5.510492],
  [5.787942, 5.115846, -14.728308],
  [-5.42372, 5.115846, -14.761919],
  [-5.373599, 5.115846, -3.704133],
  [1.004861, 5.115846, -3.641834],
];
const p0 = new THREE.Vector3();
const p1 = new THREE.Vector3();

export const curve = new THREE.CatmullRomCurve3(
  controlPoints
    .map((p, ndx) => {
      p0.set(...p);
      p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
      return [
        new THREE.Vector3().copy(p0),
        new THREE.Vector3().lerpVectors(p0, p1, 0.1),
        new THREE.Vector3().lerpVectors(p0, p1, 0.9),
      ];
    })
    .flat(),
  true
);