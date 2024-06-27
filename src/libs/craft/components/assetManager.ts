import * as THREE from "three";
import {
  DRACOLoader,
  EXRLoader,
  FBXLoader,
  FontLoader,
  GLTFLoader,
  KTX2Loader,
  OBJLoader,
  RGBELoader,
  SVGLoader,
  MeshoptDecoder,
} from "three-stdlib";

import { Component } from "./component";
import { Craft } from "../base/craft";
import { loadVideoTexture } from "../utils";

export enum ResoureType {
  GLTF = "gltfModel",
  FBX = "fbxModel",
  OBJECT = "objModel",
  TEXTURE = "texture",
  CUBE = "cubeTexture",
  HDR = "hdrTexture",
  EXR = "exrTexture",
  KTX2 = "ktx2Texture",
  FONT = "font",
  AUDIO = "audio",
  SVG = "svg",
  VIDEO = "video",
}

export interface ResourceItem {
  name: string;
  type: ResoureType;
  path: string | string[];
}

export type ResoureList = ResourceItem[];

export interface Loaders {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  fontLoader: FontLoader;
  fbxLoader: FBXLoader;
  audioLoader: THREE.AudioLoader;
  objLoader: OBJLoader;
  hdrTextureLoader: RGBELoader;
  svgLoader: SVGLoader;
  exrLoader: EXRLoader;
  ktx2Loader: KTX2Loader;
}

export interface AssetManagerConfig {
  useDracoLoader: boolean;
  useMeshoptDecoder: boolean;
  dracoDecoderPath: string;
  ktx2TranscoderPath: string;
}

/**
 * This class can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple js file to config your assets without caring about various loaders.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#assetManager
 */
class AssetManager extends Component {
  config: AssetManagerConfig;
  resourceList: ResoureList;
  items: any;
  toLoad: number;
  loaded: number;
  loaders: Partial<Loaders>;
  constructor(craft: Craft, list: ResoureList, config: Partial<AssetManagerConfig> = {}) {
    super(craft);

    const {
      useDracoLoader = false,
      useMeshoptDecoder = false,
      dracoDecoderPath = "https://www.gstatic.com/draco/versioned/decoders/1.4.3/",
      ktx2TranscoderPath = "https://unpkg.com/three/examples/jsm/libs/basis/",
    } = config;
    this.config = {
      useDracoLoader,
      useMeshoptDecoder,
      dracoDecoderPath,
      ktx2TranscoderPath,
    };

    this.resourceList = list;

    this.items = {};
    this.toLoad = list.length;
    this.loaded = 0;

    this.loaders = {};
    this.setLoaders();

    if (useDracoLoader) {
      this.setDracoLoader();
    }

    if (useMeshoptDecoder) {
      this.setMeshoptDecoder();
    }

    this.setKTX2Loader();

    this.startLoading();
  }
  // 设置加载器
  setLoaders() {
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.fontLoader = new FontLoader();
    // @ts-ignore
    this.loaders.fbxLoader = new FBXLoader();
    this.loaders.audioLoader = new THREE.AudioLoader();
    this.loaders.objLoader = new OBJLoader();
    this.loaders.hdrTextureLoader = new RGBELoader();
    this.loaders.svgLoader = new SVGLoader();
    this.loaders.exrLoader = new EXRLoader();
    this.loaders.ktx2Loader = new KTX2Loader();
  }
  // 设置draco加载器
  setDracoLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(this.config.dracoDecoderPath);
    this.loaders.gltfLoader?.setDRACOLoader(dracoLoader);
  }
  // 设置meshopt解码器
  setMeshoptDecoder() {
    const meshoptDecoder = MeshoptDecoder();
    this.loaders.gltfLoader?.setMeshoptDecoder(meshoptDecoder);
  }
  // 设置ktx2转码器
  setKTX2Loader() {
    this.loaders.ktx2Loader?.setTranscoderPath(this.config.ktx2TranscoderPath)?.detectSupport(this.craft.renderer);

    if (this.loaders.ktx2Loader) {
      this.loaders.gltfLoader?.setKTX2Loader(this.loaders.ktx2Loader);
    }
  }
  // 开始加载
  startLoading() {
    for (const resource of this.resourceList) {
      if (resource.type === ResoureType.GLTF) {
        this.loaders.gltfLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.TEXTURE) {
        this.loaders.textureLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.CUBE) {
        this.loaders.cubeTextureLoader?.load(resource.path as string[], (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.FONT) {
        this.loaders.fontLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.FBX) {
        // @ts-ignore
        this.loaders.fbxLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.AUDIO) {
        this.loaders.audioLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.OBJECT) {
        this.loaders.objLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.HDR) {
        this.loaders.hdrTextureLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.SVG) {
        this.loaders.svgLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.EXR) {
        this.loaders.exrLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.VIDEO) {
        loadVideoTexture(resource.path as string).then((file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === ResoureType.KTX2) {
        this.loaders.ktx2Loader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      }
    }
  }
  // 加载完单个素材
  resourceLoaded(resource: ResourceItem, file: any) {
    this.items[resource.name] = file;
    this.loaded += 1;
    if (this.isLoaded) {
      this.emit("ready");
    }
  }
  // 加载进度
  get loadProgress() {
    return this.loaded / this.toLoad;
  }
  // 是否加载完毕
  get isLoaded() {
    return this.loaded === this.toLoad;
  }
}

export { AssetManager };
