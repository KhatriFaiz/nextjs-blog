import PostRecord from "@/components/Records/PostRecord";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();
  return (
    <section>
      <div className="max-w-screen-lg mx-auto">
        <div className="grid gap-10">
          {posts.map((post) => (
            <PostRecord key={post._id} data={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
