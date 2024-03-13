import { state, init } from "./shared-cube";

type Data = MessageEvent["data"];

const handlers: Record<string, (data: Data) => void> = {
  init,
  size,
};

self.onmessage = function (e) {
  const fn = handlers[e.data.type];
  if (typeof fn !== "function") {
    throw new Error("no handler for type: " + e.data.type);
  }
  fn(e.data);
};

function size(data: Data) {
  state.width = data.width;
  state.height = data.height;
}

// Worker根本看不见DOM结构, 需要把尺寸变化发送给Worker
// const state = { width: 300, height: 150, pixel: 1 };
