export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);

  // 检查画布尺寸是否相同
  const needResize = canvas.width != displayWidth || canvas.height != displayHeight;

  if (needResize) {
    // 设置为相同的尺寸
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    var image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
  });
}

export function computeKernelWeight(kernel: number[]) {
  var weight = kernel.reduce(function (prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}
