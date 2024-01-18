export function resizeRendererToDisplaySize(
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement
) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false);
  }
  return needResize;
}
