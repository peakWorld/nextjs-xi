import { readJsonWithRP } from "@/utils/file.so";
import { EXTYPE, EXSETTINGS, ExSettings } from "@/const";
import "server-only";

// 预取数据(实际缓存readJsonWithRP函数调用)
// export const preload = () => {
//   void getExSettings();
// };

/**
 * 获取examples相关菜单栏数据
 */
export function getExSettings(type?: EXTYPE) {
  const exs = type ? [type] : Object.values(EXTYPE);
  return exs.reduce((res, k) => {
    res[k] = readJsonWithRP(EXSETTINGS[k]);
    return res;
  }, {} as ExSettings);
}
