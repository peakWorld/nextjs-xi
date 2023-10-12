import { getAllPostIds, getPostData } from "@/lib/posts";

export default async function Article({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  return (
    <div className="w-full">
      <div dangerouslySetInnerHTML={{ __html: postData }}></div>
    </div>
  );
}

export function generateStaticParams() {
  return getAllPostIds();
}
