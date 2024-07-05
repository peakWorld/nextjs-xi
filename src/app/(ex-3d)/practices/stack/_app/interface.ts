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
  cameraPosition: THREE.Vector3;

  /** 摄像机视线位置 */
  lookAtPosition: THREE.Vector3;

  /** 方块移动速度 */
  speed: number;

  /** 方块移动速度增量 */
  speedInc: number;

  /** 方块移动速度上限 */
  speedLimit: number;

  /** 方块移动方向 */
  moveAxis: "x" | "z";

  /** 方块移动的边 */
  moveEdge: "width" | "depth";

  /** 方块移动距离上限 */
  moveLimit: number;
}
