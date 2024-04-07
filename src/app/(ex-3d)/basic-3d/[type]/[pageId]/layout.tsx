import { TYPES } from "@/app/(ex-3d)/const";
import EXMenu from "@/app/(ex-3d)/_components/menu";

export default function Basic3DLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { type: TYPES; pageId: string };
}) {
  const { type } = params;
  return (
    <div className="page3d-by-type h-full flex">
      <EXMenu type={type} prefix="basic-3d" />
      <main className="flex-auto">{children}</main>
    </div>
  );
}
