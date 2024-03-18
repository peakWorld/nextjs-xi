import { state, init, pickPosition } from "./shared-picking";

type Data = MessageEvent["data"];

const handlers: Record<string, (data: Data) => void> = {
  init,
  size,
  mouse,
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

function mouse(data: Data) {
  pickPosition.x = data.x;
  pickPosition.y = data.y;
}
