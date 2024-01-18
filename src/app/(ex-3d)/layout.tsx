import EXMenu from "./_components/menu";

export default function P3dLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex">
      <EXMenu />
      <main className="flex-auto">{children}</main>
    </div>
  );
}
