import { Button } from "@/components/ui/button";
import { getPostsByUsername } from "@/lib/posts";
import PostRecord from "@/components/Records/PostRecord";
import Link from "next/link";

const UserArticlesPage = async ({
  params,
}: {
  params: { username: string };
}) => {
  const posts = await getPostsByUsername(params.username);

  if (!posts || !posts.length) {
    return (
      <h1 className="text-xl text-center my-16 text-gray-700">
        No posts to display
      </h1>
    );
  }

  return (
    <main>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between">
          <h1>Articles</h1>
          <div>
            <Button asChild>
              <Link href={`/${params.username}/articles/create`}>Create</Link>
            </Button>
          </div>
        </div>
        <div>
          {posts.map((post) => (
            <PostRecord data={post} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserArticlesPage;
