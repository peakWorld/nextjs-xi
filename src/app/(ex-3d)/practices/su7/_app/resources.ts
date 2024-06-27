import { ResoureType, type ResourceItem } from "@/libs/craft";

export const resources: ResourceItem[] = [
  {
    name: "bgm",
    type: ResoureType.AUDIO,
    path: "audio/bgm.mp3",
  },
  {
    name: "sm_car",
    type: ResoureType.GLTF,
    path: "mesh/sm_car.gltf",
  },
  {
    name: "sm_startroom",
    type: ResoureType.GLTF,
    path: "mesh/sm_startroom.raw.gltf",
  },
  {
    name: "sm_speedup",
    type: ResoureType.GLTF,
    path: "mesh/sm_speedup.gltf",
  },
  {
    name: "ut_car_body_ao",
    type: ResoureType.TEXTURE,
    path: "texture/t_car_body_AO.raw.jpg",
  },
  {
    name: "ut_startroom_ao",
    type: ResoureType.TEXTURE,
    path: "texture/t_startroom_ao.raw.jpg",
  },
  {
    name: "ut_startroom_light",
    type: ResoureType.TEXTURE,
    path: "texture/t_startroom_light.raw.jpg",
  },
  {
    name: "ut_floor_normal",
    type: ResoureType.TEXTURE,
    path: "texture/t_floor_normal.webp",
  },
  {
    name: "ut_floor_roughness",
    type: ResoureType.TEXTURE,
    path: "texture/t_floor_roughness.webp",
  },
  {
    name: "ut_env_night",
    type: ResoureType.HDR,
    path: "texture/t_env_night.hdr",
  },
  {
    name: "ut_env_light",
    type: ResoureType.HDR,
    path: "texture/t_env_light.hdr",
  },
  {
    name: "driving",
    type: ResoureType.FBX,
    path: "mesh/Driving.fbx",
  },
  {
    name: "decal",
    type: ResoureType.TEXTURE,
    path: "texture/decal.png",
  },
];
