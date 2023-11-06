import "@/styles/tailwind.css";
// import { preload } from "@/libs/ex.so";

export default function RootLayout(props: { children: React.ReactNode }) {
  // preload(); // 预取数据

  return (
    <html lang="en">
      <body>
        <div id="root">{props.children}</div>
      </body>
    </html>
  );
}
