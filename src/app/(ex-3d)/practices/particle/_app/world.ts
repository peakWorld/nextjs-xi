import * as THREE from "three";
import gsap from "gsap";
import * as Craft from "@/libs/craft";
import type { App } from "./index";

export class World extends Craft.Component {
  declare craft: App;
  declare container: THREE.Scene;

  constructor(craft: App) {
    super(craft);
  }

  update(time: number) {}

  dispose() {}
}
