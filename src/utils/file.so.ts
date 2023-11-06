import { readJSONSync } from "fs-extra";
import { cache } from "react";
import { srcDir } from "./env";
import "server-only";

/**
 * get json by relative path
 */
export const readJsonWithRP = cache((rp: string) => {
  let url = rp;
  if (url.startsWith("@")) {
    url = rp.replace("@", srcDir);
  }
  return readJSONSync(url);
});
