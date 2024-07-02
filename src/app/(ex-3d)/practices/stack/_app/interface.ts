export interface BoxParams {
  width: number;
  height: number;
  depth: number;
  x: number;
  y: number;
  z: number;
  color: THREE.Color;
}

export interface State {
  /** color 偏移量 */
  colorOffset: number;

  /** 当前层数 */
  level: number;

  /** Y轴高度<新增方块中心位置> */
  currentY: number;

  /** 箱子参数 */
  boxParams: BoxParams;

  /** 摄像机位置 */
  cameraPostion: THREE.Vector3;

  /** 摄像机视线位置 */
  lookAtPosition: THREE.Vector3;
}
