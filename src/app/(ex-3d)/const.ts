/** examples folder related constants*/
export enum EXTYPE {
  webgl = "w_",
  threejs = "t_",
}

export type ExMap = Record<string, (id: string, key: string) => Promise<any>>;

export type ExSettings = {
  [EXTYPE.webgl]: Array<{ path: string; title: string }>;
  [EXTYPE.threejs]: Array<{ path: string; title: string }>;
};

export const EXMAP: ExMap = {
  [EXTYPE.webgl]: (id, key = "index") =>
    import(`@/app/(ex-3d)/_cases/w_/${id}/${key}.tsx`),
  [EXTYPE.threejs]: (id, key = "index") =>
    import(`@/app/(ex-3d)/_cases/t_/${id}/${key}.tsx`),
};

export const EXSETTINGS = {
  [EXTYPE.webgl]: "@/app/(ex-3d)/_cases/w_/settings.json",
  [EXTYPE.threejs]: "@/app/(ex-3d)/_cases/t_/settings.json",
};

/****************************************************************/
