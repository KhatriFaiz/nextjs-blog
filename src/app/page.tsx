import { getPosts } from "@/lib/posts";
import PostRecord from "@/components/Records/PostRecord";

export default async function Home() {
  const posts = await getPosts();

  if (!posts || !posts.length) {
    return (
      <h1 className="text-xl text-center my-16 text-gray-700">
        No posts to display
      </h1>
    );
  }

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
