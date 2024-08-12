import { getPostBySlug } from "@/lib/posts";
import { generateHTML } from "@tiptap/html";
import parse from "html-react-parser";
import StarterKit from "@tiptap/starter-kit";
import "./style.css";

async function BlogPostPage({
  params,
}: {
  params: {
    username: string;
    slug: string;
  };
}) {
  const post = await getPostBySlug(params.slug);
  const content = generateHTML(JSON.parse(post.content), [StarterKit]);

  return (
    <main>
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="max-w-3xl">
          <article className="blog-article">
            <h1 className="text-6xl font-semibold leading-relaxed">
              {post.title}
            </h1>
            {parse(content)}
          </article>
        </div>
      </div>
    </main>
  );
}

export default BlogPostPage;
