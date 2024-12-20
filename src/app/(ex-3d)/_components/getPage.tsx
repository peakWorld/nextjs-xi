"use client";
import { useEffect, useRef } from "react";
import { useUpdate } from "ahooks";
import { Settings } from "@/app/(ex-3d)/const";

export default function GetPage({ pageId, pageKey, type }: { pageId: string; pageKey: string; type: string }) {
  const page = useRef<() => React.ReactNode>();
  const update = useUpdate();

  useEffect(() => {
    async function loadPage() {
      try {
        const pageFunc = (await Settings[type].loadPage(pageId, pageKey)).default;
        page.current = pageFunc;
        update();
      } catch (err) {
        throw err;
      }
    }
    loadPage();
  }, [pageId, pageKey, update, type]);

  const Page = page.current;

  if (!Page) return null;
  return <Page />;
}
