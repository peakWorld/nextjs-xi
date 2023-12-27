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
  children: Node[];
  isSelfClosing: boolean;
}

export interface Attribute {
  type: "Attribute";
  name: string;
  value: any;
}

export interface Text {
  type: "Text";
  content: string;
}

export interface Interpolation {
  type: "Interpolation";
  content: {
    type: "Expression";
    content: string;
  };
}

export interface Comment {
  type: "Comment";
  content: string;
}

export type Node = Element | Text | Interpolation | Comment;
