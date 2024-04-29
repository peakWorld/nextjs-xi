import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "basic-3d",
  description: "Basic 3D Technology",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
