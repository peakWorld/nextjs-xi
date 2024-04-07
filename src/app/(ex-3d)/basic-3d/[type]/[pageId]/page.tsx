import GetPage from "@/app/(ex-3d)/_components/getPage";
import { TYPES } from "@/app/(ex-3d)/const";
import useNotFound from "@/app/(ex-3d)/_hooks/useExNotFound";

export default function Page3DByType({
  params,
  searchParams,
}: {
  params: { type: TYPES; pageId: string };
  searchParams: { k: string };
}) {
  const { type, pageId } = params;
  const { k } = searchParams;
  useNotFound(type, pageId, k);
  return <GetPage pageId={pageId} pageKey={k} type={type} />;
}

export async function generateMetadata({ params }: { params: { type: TYPES; pageId: string } }) {
  const { type } = params;
  const title = type.slice(0, 1).toUpperCase() + type.slice(1);
  return {
    title,
  };
}
