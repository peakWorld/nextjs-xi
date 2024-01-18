import { mat4, vec3 } from "gl-matrix";

export type TNumber = Tuple<number, 3>;

const YAW = -90.0;
const PITCH = 0.0;
const SPEED = 0.25;
const SENSITIVITY = 0.001;
const ZOOM = 45.0;

export class Camera {
  private pos!: vec3; // 位置

  private front!: vec3; // 目标

  private up!: vec3; // 上向量

  private right!: vec3;

  private zoom = ZOOM; // 视角

  private sensitivity = SENSITIVITY;

  private speed = SPEED;

  private constrainPitch = true;

  private yaw = YAW; // 偏航角, 与xy平面形成的夹角

  private pitch = PITCH; // 俯仰角, 与xz平面形成的夹角

  private deltaTime = 0;

  private postTime = 0;

  private mouse = {
    isFirst: true,
    lastX: 0,
    laxtY: 0,
  };

  constructor(pos: TNumber, up: TNumber = [0, 1, 0]) {
    this.pos = vec3.fromValues(...pos);
    this.up = vec3.fromValues(...up);
    this.front = vec3.fromValues(0, 0, -1); // 确保相机始终指向Z轴负方向(此相机设定要垂直于xy面)
    this.right = vec3.fromValues(1, 0, 0);
  }

  getViewMat(deltaTime: number) {
    if (!this.postTime) {
      this.postTime = deltaTime;
    }
    this.deltaTime = deltaTime - this.postTime;
    this.postTime = deltaTime;

    return mat4.lookAt(
      mat4.create(),
      this.pos,
      vec3.add(vec3.create(), this.pos, this.front),
      this.up
    );
  }

  get Zoom() {
    return this.zoom;
  }

  onMouseMove(x: number, y: number) {
    if (this.mouse.isFirst) {
      this.mouse.lastX = x;
      this.mouse.laxtY = y;
      this.mouse.isFirst = false;
    }

    let xoffset = x - this.mouse.lastX;
    let yoffset = y - this.mouse.laxtY;

    this.mouse.lastX = x;
    this.mouse.laxtY = y;

    xoffset *= this.sensitivity;
    yoffset *= this.sensitivity;

    this.yaw += xoffset;
    this.pitch += yoffset;

    if (this.constrainPitch) {
      if (this.pitch > 89) {
        this.pitch = 89;
      }
      if (this.pitch < -89) {
        this.pitch = -89;
      }
    }

    this.updateCameraVectors();
  }

  onKeyUp(key: string) {
    const velocity = this.speed * this.deltaTime;
    if (key === "w") {
      this.pos = vec3.scaleAndAdd(
        vec3.create(),
        this.pos,
        this.front,
        velocity
      );
    }
    if (key === "s") {
      this.pos = vec3.scaleAndAdd(
        vec3.create(),
        this.pos,
        this.front,
        -velocity
      );
    }
    if (key === "a") {
      this.pos = vec3.scaleAndAdd(
        vec3.create(),
        this.pos,
        this.right,
        -velocity
      );
    }
    if (key === "d") {
      this.pos = vec3.scaleAndAdd(
        vec3.create(),
        this.pos,
        this.right,
        velocity
      );
    }

    this.pos[1] = 0;
  }

  private updateCameraVectors() {
    const front = vec3.fromValues(
      Math.cos(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.sin(this.yaw) * Math.cos(this.pitch)
    );
    this.front = vec3.normalize(vec3.create(), front);
    this.right = vec3.normalize(
      vec3.create(),
      vec3.cross(vec3.create(), this.front, this.up)
    );
    this.up = vec3.normalize(
      vec3.create(),
      vec3.cross(vec3.create(), this.right, this.front)
    );
  }
}
