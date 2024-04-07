import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Welcome to My Blog",
};

export default async function Home() {
  return (
    <div className="flex items-center justify-center flex-col">
      <h1>Welcome to My Blog</h1>
      <Link href={`/basic-3d`}>Go To Basic 3D</Link>
    </div>
  );
}
