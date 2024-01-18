import { getExSettings } from "@/app/(ex-3d)/_utils/ex.so";
import SiderBar from "./sidebar";

export default async function Menu() {
  const settings = getExSettings();
  return <SiderBar menus={settings} />;
}
