/** examples folder related constants*/
export enum EXTYPE {
  webgl = "w_",
  threejs = "t_",
}

export type ExMap = Record<string, (id: string) => Promise<any>>;

export type ExSettings = {
  [EXTYPE.webgl]: Array<{ path: string; title: string }>;
  [EXTYPE.threejs]: Array<{ path: string; title: string }>;
};

export const EXMAP: ExMap = {
  [EXTYPE.webgl]: (id) => import(`@/examples/w_/${id}/index`),
  [EXTYPE.threejs]: (id) => import(`@/examples/t_/${id}/index`),
};

export const EXSETTINGS = {
  [EXTYPE.webgl]: "@/examples/w_/settings.json",
  [EXTYPE.threejs]: "@/examples/t_/settings.json",
};

/****************************************************************/
