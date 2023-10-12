import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "文档中心",
  description: "Welcome to Next.js",
};

export default async function Home() {
  return (
    <div className="flex items-center justify-center" id="root">
      <Link href={`/article/pre-rendering`}>Go To Article</Link>
    </div>
  );
}
