import * as THREE from "three";
import type { Craft } from "@/libs/craft";
import Screen from "./base";

export default class Spring extends Screen {
  constructor(craft: Craft, ele: HTMLDivElement) {
    super(craft, ele);
  }
}
