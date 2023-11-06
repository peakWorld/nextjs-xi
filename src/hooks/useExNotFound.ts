import { notFound } from "next/navigation";
import { EXTYPE } from "@/const";
import { getExSettings } from "@/libs/ex.so";

// 屏蔽
export default function useExNotFound(type: EXTYPE, id: string) {
  const tp = getExSettings(type)[type];
  if (!tp.find(({ path }) => path === id)) {
    notFound();
  }
}
