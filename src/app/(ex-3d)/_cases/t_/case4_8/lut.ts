//@ts-nocheck
import * as THREE from "three";

interface Info {
  name: string;
  size: number;
  filter: boolean;
  texture: THREE.Texture;
  url: string;
}

// webgl1不支持3d纹理, 此处用4x2的2d纹理模拟3d纹理
export const makeIdentityLutTexture = (function () {
  const identityLUT = new Uint8Array([
    0,
    0,
    0,
    255, // black
    255,
    0,
    0,
    255, // red
    0,
    0,
    255,
    255, // blue
    255,
    0,
    255,
    255, // magenta
    0,
    255,
    0,
    255, // green
    255,
    255,
    0,
    255, // yellow
    0,
    255,
    255,
    255, // cyan
    255,
    255,
    255,
    255, // white
  ]);

  return function (filter: boolean) {
    // identityLUT 纹理数据, rgba表示一个纹数
    // 此处 4 纹理宽度, 2 纹理高度
    const texture = new THREE.DataTexture(identityLUT, 4, 2);
    texture.minFilter = texture.magFilter = filter ? THREE.LinearFilter : THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;
    return texture;
  };
})();

// 加载3dlut纹理, 整合到图片中左上角
export const makeLUTTexture = (function () {
  const imgLoader = new THREE.ImageLoader();
  const ctx = document.createElement("canvas").getContext("2d");

  return function (info: Info) {
    const lutSize = info.size;
    const width = lutSize * lutSize;
    const height = lutSize;
    const texture = new THREE.DataTexture(new Uint8Array(width * height), width, height);
    texture.minFilter = texture.magFilter = info.filter ? THREE.LinearFilter : THREE.NearestFilter;
    texture.flipY = false;

    if (info.url) {
      imgLoader.load(info.url, function (image) {
        ctx!.canvas.width = width;
        ctx!.canvas.height = height;
        ctx!.drawImage(image, 0, 0);
        const imageData = ctx!.getImageData(0, 0, width, height);

        // 根据图片数据更新texture
        texture.image.data = new Uint8Array(imageData.data.buffer);
        texture.image.width = width;
        texture.image.height = height;
        texture.needsUpdate = true;
      });
    }

    return texture;
  };
})();

export const lutNameIndexMap: Record<string, number> = {};
export const lutTextures = [
  {
    name: "identity",
    size: 2, // 其实是Z的值, 按Z值切面、然后平铺
    filter: true,
  },
  {
    name: "identity not filtered",
    size: 2,
    filter: false,
  },

  { name: "custom", url: "/t_/3dlut-red-only-s16.png" },
  { name: "monochrome", url: "/t_/monochrome-s8.png" },
] as unknown as Info[];

lutTextures.forEach((info, ndx) => {
  if (info.url) {
    // examples:
    //    'foo-s16.png' = size:16, filter: true
    //    'bar-s8n.png' = size:8, filter: false
    const m = /-s(\d+)(n*)\.[^.]+$/.exec(info.url);
    if (m) {
      info.size = parseInt(m[1]);
      info.filter = info.filter === undefined ? m[2] !== "n" : info.filter;
    }
    info.texture = makeLUTTexture(info);
  } else {
    info.texture = makeIdentityLutTexture(info.filter);
  }

  lutNameIndexMap[info.name] = ndx;
});

// 打开过滤: GPU会在颜色之间线性插值。
export const lutShader = {
  uniforms: {
    tDiffuse: { value: null },
    lutMap: { value: null },
    lutMapSize: { value: 1 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    #include <common>

    #define FILTER_LUT true

    uniform sampler2D tDiffuse;
    uniform sampler2D lutMap;
    uniform float lutMapSize;

    varying vec2 vUv;

    vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
      float sliceSize = 1.0 / size;
      float slicePixelSize = sliceSize / size;
      float width = size - 1.0;
      float sliceInnerSize = slicePixelSize * width;
      float zSlice0 = floor( texCoord.z * width);
      float zSlice1 = min( zSlice0 + 1.0, width);
      float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
      float yRange = (texCoord.y * width + 0.5) / size;
      float s0 = xOffset + (zSlice0 * sliceSize);

      #ifdef FILTER_LUT
        float s1 = xOffset + (zSlice1 * sliceSize);
        vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
        vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
        float zOffset = mod(texCoord.z * width, 1.0);
        return mix(slice0Color, slice1Color, zOffset);
      #else
        return texture2D(tex, vec2( s0, yRange));
      #endif
    }

    void main() {
      vec4 originalColor = texture2D(tDiffuse, vUv);
      gl_FragColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
    }
  `,
};

// 关闭过滤: 在3DLUT中查找颜色只会给出精确颜色, 不会在颜色之间插值。
export const lutNearestShader = {
  uniforms: { ...lutShader.uniforms },
  vertexShader: lutShader.vertexShader,
  fragmentShader: lutShader.fragmentShader.replace("#define FILTER_LUT", "//"),
};
