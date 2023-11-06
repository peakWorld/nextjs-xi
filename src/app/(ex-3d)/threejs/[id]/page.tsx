import GetPage from "@/components/getPage";
import { EXTYPE } from "@/const";
import useNotFound from "@/hooks/useExNotFound";

export default function Threejs({ params }: { params: { id: string } }) {
  useNotFound(EXTYPE.threejs, params.id);
  return <GetPage id={params.id} type={EXTYPE.threejs} />;
}
