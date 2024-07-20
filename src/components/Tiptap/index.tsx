"use client";

import "./style.css";
import { useEditor, EditorContent, Editor, Extension } from "@tiptap/react";
import { Bold, ChevronDown, Italic, UnderlineIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TiptapProps {
  editor: Editor | null;
}

const Tiptap = ({ editor }: TiptapProps) => {
  const insertImage = (src: string) => {
    return editor?.commands.insertContentAt(
      editor.state.selection.anchor,
      `<img src="${src}" alt="Something" />`
    );
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} insertImage={insertImage} />
      <EditorContent editor={editor} />
    </>
  );
};

const Toolbar = ({
  editor,
  insertImage,
}: {
  editor: Editor;
  insertImage: (src: string) => boolean | undefined;
}) => {
  return (
    <div className="border rounded-t-md flex gap-2 items-center py-0.5 px-0.5">
      <SelectTextTypeDropdown editor={editor} />
      <div>
        <Button
          size="icon"
          variant={editor?.isActive("bold") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold />
        </Button>
        <Button
          size="icon"
          variant={editor?.isActive("italic") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </Button>
        <Button
          size="icon"
          variant={editor?.isActive("underline") ? "secondary" : "ghost"}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </Button>
      </div>
      <InsertImageDialog insertImage={insertImage} />
    </div>
  );
};

type TextTypes = "normal" | "heading-1" | "heading-2" | "heading-3";

const SelectTextTypeDropdown = ({ editor }: { editor: Editor | null }) => {
  const [value, setValue] = useState<TextTypes>("normal");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {value} <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={value}>
          <DropdownMenuRadioItem
            value="normal"
            onSelect={() => {
              setValue("normal");
              editor?.commands.setParagraph();
            }}
          >
            Normal
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="heading-1"
            onSelect={() => {
              setValue("heading-1");
              editor?.commands.setHeading({ level: 1 });
            }}
          >
            Heading 1
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="heading-2"
            onSelect={() => {
              setValue("heading-2");
              editor?.commands.setHeading({ level: 2 });
            }}
          >
            Heading 2
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="heading-3"
            onSelect={() => {
              setValue("heading-3");
              editor?.commands.setHeading({ level: 3 });
            }}
          >
            Heading 3
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const InsertImageFormSchema = z.object({
  image: z.instanceof(FileList),
});

interface InsertImageDialogProps {
  insertImage: (src: string) => boolean | undefined;
}

const InsertImageDialog = ({ insertImage }: InsertImageDialogProps) => {
  const form = useForm<z.infer<typeof InsertImageFormSchema>>({
    resolver: zodResolver(InsertImageFormSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = form.register("image");

  const prepareFormData = (data: z.infer<typeof InsertImageFormSchema>) => {
    const formdata = new FormData();
    formdata.append("image", data.image[0]);
    return formdata;
  };

  const uploadImage = async (formData: FormData) => {
    const response = await fetch("/api/assets/images", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return result;
  };

  const handleResponse = (result: any) => {
    if (result.success) {
      insertImage(result.imageURL);
    }
    setIsLoading(false);
  };

  const onSubmit = async (data: z.infer<typeof InsertImageFormSchema>) => {
    setIsLoading(true);
    const formData = prepareFormData(data);
    const result = await uploadImage(formData);
    handleResponse(result);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Insert image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Select image</DialogHeader>
        <div className="my-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Image</FormLabel>
                      <FormControl>
                        <Input type="file" {...imageRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {!isLoading ? "Upload" : "Uploading..."}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Tiptap;
