import * as THREE from "three";

type Data = MessageEvent["data"];

export const state = { width: 300, height: 150, pixel: 1 };

export function init(data: Data) {
  const { canvas } = data;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });

  const scene = new THREE.Scene();

  const fov = 75;
  const aspect = 2; // canvas默认大小
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeCube(geometry: THREE.BoxGeometry, color: number, x: number) {
    const material = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
  }

  const cubes = [makeCube(geometry, 0x8844aa, -2), makeCube(geometry, 0x44aa88, 0), makeCube(geometry, 0xaa8844, 2)];

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const width = state.width;
    const height = state.height;
    const needResize = canvas.width !== width || canvas.height !== height; // 像素尺寸不等于显示尺寸, 才更新
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      camera.aspect = state.width / state.height;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((it, ndx) => {
      const speed = 1 + ndx * 0.2;
      const rot = time * speed;
      it.rotation.x = rot;
      it.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
