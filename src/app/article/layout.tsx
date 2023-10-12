import "@/styles/article/layout.scss";
import SideMenu from "@/components/menu";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 flex">
      <SideMenu />
      <main className="flex-auto">{children}</main>
    </div>
  );
}
