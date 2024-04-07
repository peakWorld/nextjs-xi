import { TYPES, Settings, type Menu } from "@/app/(ex-3d)/const";
import { readJsonWithRP } from "@/utils/file.so";
import SiderBar from "./sidebar";

export default async function Menu(props: { type: TYPES; prefix: string }) {
  const { type, prefix } = props;
  const { settingPath } = Settings[type];
  const menuData = readJsonWithRP(settingPath) as Menu;
  return <SiderBar menus={menuData} prefix={prefix} />;
}
