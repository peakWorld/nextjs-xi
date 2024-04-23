import * as THREE from "three";

type TNumber = [number, number, number];

interface Face {
  dir: TNumber;
  corners: [TNumber, TNumber, TNumber, TNumber];
}

// 区块生成器
// 调用函数generateGeometryDataForCell生成一个区块cell
// 区块中的每个单元称为 体素
// 将cell理解成一个立方体(边长cellSize), 但真实数据是个一维数组

export class VoxelWorld {
  static faces: Face[];

  private cellSliceSize: number;
  private cell: Uint8Array;

  constructor(private cellSize: number) {
    this.cellSize = cellSize; // 区块大小
    this.cellSliceSize = cellSize * cellSize; // 区块切片大小
    this.cell = new Uint8Array(cellSize * cellSize * cellSize);
  }
  computeVoxelOffset(x: number, y: number, z: number) {
    const { cellSize, cellSliceSize } = this;
    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
    return voxelY * cellSliceSize + voxelZ * cellSize + voxelX;
  }
  getCellForVoxel(x: number, y: number, z: number) {
    const { cellSize } = this;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellZ = Math.floor(z / cellSize);
    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
      return null;
    }

    return this.cell;
  }
  // 填充cell数据
  // 体素在x/y/z方向的位置计算在cell中索引, 并且对该体素填充数据
  setVoxel(x: number, y: number, z: number, v: number) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return;
    }

    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
  // 根据体素在x/y/z方向的位置, 获取在cell中的索引
  getVoxel(x: number, y: number, z: number) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return 0;
    }

    const voxelOffset = this.computeVoxelOffset(x, y, z);
    return cell[voxelOffset];
  }

  // 根据索引生成区块, 且区块中的体素只渲染必要的边
  generateGeometryDataForCell(cellX: number, cellY: number, cellZ: number) {
    const { cellSize } = this;
    const positions = [];
    const normals = [];
    const indices = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ); // 获取在一维数组中的标志, 是否渲染体素
          if (voxel) {
            for (const { dir, corners } of VoxelWorld.faces) {
              // 对每一个面, 判断是否渲染
              const neighbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2]); // 该面是否有邻居
              if (!neighbor) {
                const ndx = positions.length / 3;
                // 计算每个面四个点的世界坐标
                for (const pos of corners) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                  normals.push(...dir);
                }
                // 存储坐标点的索引, 每个ndx对应一个坐标位置(position)
                indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
              }
            }
          }
        }
      }
    }

    return {
      positions,
      normals,
      indices,
    };
  }
}

// 单位立方体的六个面
// 用处 => 在绘制像素几何时, 只绘制展示的面
VoxelWorld.faces = [
  {
    // left
    dir: [-1, 0, 0], // 法向量
    // 坐标点
    corners: [
      [0, 1, 0],
      [0, 0, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  },
  {
    // right
    dir: [1, 0, 0],
    corners: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
      [1, 0, 0],
    ],
  },
  {
    // bottom
    dir: [0, -1, 0],
    corners: [
      [1, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
  },
  {
    // top
    dir: [0, 1, 0],
    corners: [
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 0],
    ],
  },
  {
    // back
    dir: [0, 0, -1],
    corners: [
      [1, 0, 0],
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  {
    // front
    dir: [0, 0, 1],
    corners: [
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ],
  },
];
