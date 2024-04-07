import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "basic-3d",
  description: "All 3D Technology",
};

export default async function Basic3DPage() {
  return (
    <div className="flex items-center justify-center flex-col">
      <Link href={`/basic-3d/webgl/case1`}>Go To Webgl</Link>
      <Link href={`/basic-3d/threejs/case1_1`}>Go To Threejs</Link>
    </div>
  );
}
