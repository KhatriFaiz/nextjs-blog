import Link from "next/link";

interface Author {
  _id: string;
  username: string;
}

interface PostRecordProps {
  data: {
    title: string;
    slug: string;
    author: Author;
  };
}

function PostRecord({ data }: PostRecordProps) {
  return (
    <div className="w-full border shadow-md rounded-md p-5 ">
      <h2 className="text-2xl font-bold mb-3">
        <Link href={`/${data.author?.username || "#"}/${data.slug}`}>
          {data.title}
        </Link>
      </h2>
      <Author data={data.author} />
      <Link href={`${data.author._id}/${data.slug}`} className="underline">
        Read {">>"}
      </Link>
    </div>
  );
}

interface AuthorProps {
  data: Author;
}

function Author({ data }: AuthorProps) {
  return (
    <div className="flex items-center gap-2">
      <span>By</span>
      <span>{data.username}</span>
    </div>
  );
}

export default PostRecord;
