import * as THREE from "three";

class AxisGridHelper {
  private grid!: THREE.GridHelper;

  private axes!: THREE.AxesHelper;

  private _visible!: boolean;

  constructor(node: THREE.Object3D, units = 10) {
    const axes = new THREE.AxesHelper();
    (axes.material as THREE.Material).depthTest = false;
    axes.renderOrder = 2; // 在网格渲染之后再渲染
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1; // 在球体渲染之后再渲染
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

export default AxisGridHelper;
