import { notFound } from "next/navigation";
import { Settings, type Menu, type MenuItem } from "@/app/(ex-3d)/const";
import { readJsonWithRP } from "@/utils/file.so";

export default function useExNotFound(type: string, id: string, k: string) {
  const { settingPath } = Settings[type];
  const tp = readJsonWithRP(settingPath) as Menu;
  const url = k ? `${id}?k=${k}` : id;

  const pathes = tp.reduce((acc, cur) => {
    if (cur.children?.length) {
      acc = [...acc, ...cur.children];
    }
    return acc;
  }, [] as MenuItem[]);

  if (!pathes.find(({ path }) => path === url)) {
    notFound();
  }
}
