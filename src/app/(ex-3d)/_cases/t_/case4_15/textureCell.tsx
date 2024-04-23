import * as THREE from "three";

type TNumber = [number, number, number];

interface Face {
  uvRow: number;
  dir: TNumber;
  corners: Array<{
    pos: TNumber;
    uv: [number, number];
  }>;
}

// 区块生成器
// 调用函数generateGeometryDataForCell生成一个区块cell
// 区块中的每个单元称为 体素
// 将cell理解成一个立方体(边长cellSize), 但真实数据是个一维数组

export class VoxelWorld {
  static faces: Face[];

  // cell区块相关
  private cellSize: number;
  private cellSliceSize: number;
  private cell: Uint8Array;

  // 纹理相关
  private tileSize: number;
  private tileTextureWidth: number;
  private tileTextureHeight: number;

  constructor(options: any) {
    this.cellSize = options.cellSize;
    this.tileSize = options.tileSize;
    this.tileTextureWidth = options.tileTextureWidth;
    this.tileTextureHeight = options.tileTextureHeight;
    const { cellSize } = this;
    this.cellSliceSize = cellSize * cellSize;
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
  // 给cell中的体素填充数据
  setVoxel(x: number, y: number, z: number, v: number) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return;
    }

    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
  // 获取在cell体素中的值
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
    const { cellSize, tileSize, tileTextureWidth, tileTextureHeight } = this;
    const positions = [];
    const normals = [];
    const indices = [];
    const uvs = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ); // 获取在一维数组中的值(整数, 1 <= voxel <= 16),
          if (voxel) {
            const uvVoxel = voxel - 1; // 作为纹理坐标U的随机值, 此处减1 => [0, 15]
            for (const { dir, corners, uvRow } of VoxelWorld.faces) {
              // 对每一个面, 判断是否渲染
              const neighbor = this.getVoxel(voxelX + dir[0], voxelY + dir[1], voxelZ + dir[2]); // 该面是否有邻居
              if (!neighbor) {
                const ndx = positions.length / 3;
                // 计算每个面四个点的世界坐标
                for (const { pos, uv } of corners) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                  normals.push(...dir);

                  // 纹理横轴分为16块 uvVoxel[0, 15] + uv[0] => [0, 16]/16
                  // 纹理纵轴分为4块  uvRow[0, 3] + 1 - uv[1] => 1 - [0, 4]/4
                  uvs.push(
                    ((uvVoxel + uv[0]) * tileSize) / tileTextureWidth,
                    1 - ((uvRow + 1 - uv[1]) * tileSize) / tileTextureHeight
                  );
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
      uvs,
    };
  }
}

// 单位立方体(位于第一象限)的六个面, 点坐标、纹理坐标、法向量
// 用处 => 在绘制像素几何时, 只绘制展示的面
VoxelWorld.faces = [
  {
    // left
    uvRow: 0,
    dir: [-1, 0, 0],
    corners: [
      { pos: [0, 1, 0], uv: [0, 1] },
      { pos: [0, 0, 0], uv: [0, 0] },
      { pos: [0, 1, 1], uv: [1, 1] },
      { pos: [0, 0, 1], uv: [1, 0] },
    ],
  },
  {
    // right
    uvRow: 0,
    dir: [1, 0, 0],
    corners: [
      { pos: [1, 1, 1], uv: [0, 1] },
      { pos: [1, 0, 1], uv: [0, 0] },
      { pos: [1, 1, 0], uv: [1, 1] },
      { pos: [1, 0, 0], uv: [1, 0] },
    ],
  },
  {
    // bottom
    uvRow: 1,
    dir: [0, -1, 0],
    corners: [
      { pos: [1, 0, 1], uv: [1, 0] },
      { pos: [0, 0, 1], uv: [0, 0] },
      { pos: [1, 0, 0], uv: [1, 1] },
      { pos: [0, 0, 0], uv: [0, 1] },
    ],
  },
  {
    // top
    uvRow: 2,
    dir: [0, 1, 0],
    corners: [
      { pos: [0, 1, 1], uv: [1, 1] },
      { pos: [1, 1, 1], uv: [0, 1] },
      { pos: [0, 1, 0], uv: [1, 0] },
      { pos: [1, 1, 0], uv: [0, 0] },
    ],
  },
  {
    // back
    uvRow: 0,
    dir: [0, 0, -1],
    corners: [
      { pos: [1, 0, 0], uv: [0, 0] },
      { pos: [0, 0, 0], uv: [1, 0] },
      { pos: [1, 1, 0], uv: [0, 1] },
      { pos: [0, 1, 0], uv: [1, 1] },
    ],
  },
  {
    // front
    uvRow: 0,
    dir: [0, 0, 1],
    corners: [
      { pos: [0, 0, 1], uv: [0, 0] },
      { pos: [1, 0, 1], uv: [1, 0] },
      { pos: [0, 1, 1], uv: [0, 1] },
      { pos: [1, 1, 1], uv: [1, 1] },
    ],
  },
];
