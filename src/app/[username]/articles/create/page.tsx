import BlogPostEditor from "@/components/BlogPostEditor";

const CreateArticlePage = async ({
  params,
}: {
  params: { username: string };
}) => {
  return (
    <main className="py-10">
      <div className="max-w-screen-xl mx-auto">
        <BlogPostEditor username={params.username} />
      </div>
    </main>
  );
};

export default CreateArticlePage;
