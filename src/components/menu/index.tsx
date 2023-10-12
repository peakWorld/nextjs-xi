import { getSortedPostsData } from "@/lib/posts";
import SiderBar from "./sidebar";

export default async function Menu() {
  const menus = getSortedPostsData();
  return (
    <div className="w-32 flex flex-col items-center mr-3">
      <SiderBar menus={menus} />
    </div>
  );
}
