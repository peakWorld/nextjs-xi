import EXMenu from "@/components/ex/menu";

export default function P3dLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 flex">
      <EXMenu />
      <main className="flex-auto">{children}</main>
    </div>
  );
}
