import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const UserArticlesPage = ({ params }: { params: { username: string } }) => {
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
      </div>
    </main>
  );
};

export default UserArticlesPage;
