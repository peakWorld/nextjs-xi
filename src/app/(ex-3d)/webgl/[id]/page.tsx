import GetPage from "@/app/(ex-3d)/_components/getPage";
import { EXTYPE } from "@/app/(ex-3d)/const";
import useNotFound from "@/app/(ex-3d)/_hooks/useExNotFound";

export default async function Webgl({ params }: { params: { id: string } }) {
  useNotFound(EXTYPE.webgl, params.id);
  return <GetPage id={params.id} type={EXTYPE.webgl} />;
}
