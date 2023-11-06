import GetPage from "@/components/getPage";
import { EXTYPE } from "@/const";
import useNotFound from "@/hooks/useExNotFound";

export default async function Webgl({ params }: { params: { id: string } }) {
  useNotFound(EXTYPE.webgl, params.id);
  return <GetPage id={params.id} type={EXTYPE.webgl} />;
}
