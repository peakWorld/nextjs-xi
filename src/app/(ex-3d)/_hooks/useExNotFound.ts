import { notFound } from "next/navigation";
import { EXTYPE } from "@/app/(ex-3d)/const";
import { getExSettings } from "@/app/(ex-3d)/_utils/ex.so";

// 屏蔽
export default function useExNotFound(type: EXTYPE, id: string) {
  const tp = getExSettings(type)[type];
  if (!tp.find(({ path }) => path === id)) {
    notFound();
  }
}
