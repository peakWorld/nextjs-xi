export type MenuItem = { path: string; title: string };

export type Menu = Array<{
  summary: string;
  children: MenuItem[];
  isOpen?: boolean;
}>;

interface Setting {
  loadPage: (id: string, key: string) => Promise<any>;
  settingPath: string;
}

export enum TYPES {
  webgl = "w_",
  threejs = "t_",
  glsl = "g_",
}

export const Settings = Object.entries(TYPES).reduce((acc, [k, v]) => {
  acc[k] = {
    loadPage(id: string, key = "index") {
      return import(`@/app/(ex-3d)/_cases/${v}/${id}/${key}.tsx`);
    },
    settingPath: `@/app/(ex-3d)/_cases/${v}/settings.json`,
  };
  return acc;
}, {} as Record<string, Setting>);
