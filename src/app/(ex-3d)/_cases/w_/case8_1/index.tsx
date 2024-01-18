// import useWebgl from "@/app/(ex-3d)/_hooks/w_/useWebgl";
// import { mat4, vec3 } from "gl-matrix";
// import { useCallback } from "react";

// // 点光源
// import vs_frag from "./p_l.vs";
// import fs_frag from "./p_l.fs";

// import Model from "./model";
// const modelFiles = import.meta.glob(
//   "@/assets/w_/nanosuit/*.(png|jpg|mtl|obj)",
//   { as: "url", eager: true }
// );

// export default function Case8_1() {
//   useWebgl(
//     "#case8",
//     useCallback(async (w) => {
//       const { gl, view, render, createShader } = w;

//       gl.enable(gl.DEPTH_TEST);
//       const model = new Model(w, Object.keys(modelFiles));
//       const shader = createShader(vs_frag, fs_frag);

//       const viewPos: Tuple<number, 3> = [-10, 25, 12];

//       // 键盘移动光源位置
//       const handler: (ev: KeyboardEvent) => void = (ev) => {
//         if (ev.key === "d") {
//           viewPos[0] += 0.1;
//         }
//         if (ev.key === "a") {
//           viewPos[0] -= 0.1;
//         }

//         if (ev.key === "w") {
//           viewPos[1] += 0.1;
//         }
//         if (ev.key === "s") {
//           viewPos[1] -= 0.1;
//         }

//         if (ev.key === "j") {
//           viewPos[2] += 0.1;
//         }
//         if (ev.key === "l") {
//           viewPos[2] -= 0.1;
//         }
//       };
//       window.addEventListener("keydown", handler, false);

//       let last = Date.now();
//       const ANGLE_STEP = 3.0;
//       let currentAngle = 0;

//       render((now) => {
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//         gl.clearColor(0.0, 0.0, 0.0, 1.0);

//         const elapsed = now - last;
//         last = now;
//         currentAngle = (currentAngle + (ANGLE_STEP * elapsed) / 3000.0) % 360;

//         const vMat = mat4.lookAt(
//           mat4.create(),
//           vec3.fromValues(...viewPos),
//           vec3.fromValues(0, 0, 0),
//           vec3.fromValues(0, 1, 0)
//         );
//         const pMat = mat4.perspective(mat4.create(), 45, view.aspect, 0.1, 100);
//         const mMat = mat4.create();
//         mat4.rotate(mMat, mMat, currentAngle, vec3.fromValues(1, 1, 0));
//         shader.use();
//         shader.setMat("model", mMat);
//         shader.setMat("view", vMat);
//         shader.setMat("projection", pMat);

//         model.draw(shader);
//       });
//     }, [])
//   );

//   return <div id="case8">Case8_1</div>;
// }
