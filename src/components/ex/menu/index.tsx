import { getExSettings } from "@/libs/ex.so";
import SiderBar from "./sidebar";

export default async function Menu() {
  const settings = getExSettings();
  return <SiderBar menus={settings} />;
}
