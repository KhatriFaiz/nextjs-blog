"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditor } from "@tiptap/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import StarterKit from "@tiptap/starter-kit";
import Tiptap from "../Tiptap";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

const BlogPostEditorSchema = z.object({
  content: z.string(),
  slug: z.string(),
  title: z.string(),
});

interface BlogPostEditorProps {
  username: string;
}

const BlogPostEditor = ({ username }: BlogPostEditorProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof BlogPostEditorSchema>>({
    resolver: zodResolver(BlogPostEditorSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "border border-b-none p-5 rounded-t-none rounded-md",
      },
    },
    extensions: [StarterKit, Underline, Image],
    content: "<p>Hello World! 🌎️</p>",
    onUpdate() {
      form.setValue("content", JSON.stringify(editor?.getJSON()));
    },
  });

  const onSubmit = async (data: z.infer<typeof BlogPostEditorSchema>) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ ...data, author: username }),
    });
    const result = await response.json();
    if (!result.success) {
      console.log("Couldn't create post.");
    }
    if (result.success) {
      router.push(`/${username}/articles`);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-end mb-3">
          <Button type="submit">Publish</Button>
        </div>
        <div className="grid gap-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Tiptap editor={editor} />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostEditor;
