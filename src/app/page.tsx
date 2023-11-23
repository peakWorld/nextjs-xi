import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Welcome to My Blog",
};

export default async function Home() {
  return (
    <div className="flex items-center justify-center flex-col" id="root">
      <Link href={`/webgl/case1`}>Go To Webgl</Link>
      <Link href={`/threejs/case1_1`}>Go To Threejs</Link>
      <Link href={`/blog`}>Go To Blog</Link>
    </div>
  );
}
