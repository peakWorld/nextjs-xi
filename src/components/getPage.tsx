"use client";
import { useEffect, useRef } from "react";
import { useUpdate } from "ahooks";
import { EXMAP } from "@/const";
import Link from "next/link";

export default function GetPage({ id, type }: { id: string; type: string }) {
  const page = useRef<() => React.ReactNode>();
  const update = useUpdate();

  useEffect(() => {
    async function loadPage() {
      try {
        const pageFunc = (await EXMAP[type](id)).default;
        page.current = pageFunc;
        update();
      } catch (err) {
        throw err;
      }
    }
    loadPage();
  }, [id, update, type]);

  const Page = page.current;

  if (!Page) return null;
  return <Page />;
}
