import GetPage from "@/app/(ex-3d)/_components/getPage";
import { EXTYPE } from "@/app/(ex-3d)/const";
import useNotFound from "@/app/(ex-3d)/_hooks/useExNotFound";

export default async function Webgl({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { k: string };
}) {
  useNotFound(EXTYPE.webgl, params.id, searchParams.k);
  return (
    <GetPage pageId={params.id} pageKey={searchParams.k} type={EXTYPE.webgl} />
  );
}
