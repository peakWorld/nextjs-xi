export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 flex">
      <main className="flex-auto">{children}</main>
    </div>
  );
}
