import { type TextModes } from "./constant";

export interface Context {
  source: string;
  mode: TextModes;
  advanceBy: (size: number) => void;
  advanceSpaces: () => void;
}

export interface Element {
  type: "Element";
  tag: string;
  props: Attribute[];
  children: Element[];
  isSelfClosing: boolean;
}

export interface Attribute {
  type: "Attribute";
  name: string;
  value: any;
}
