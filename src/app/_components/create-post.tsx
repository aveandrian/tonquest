"use client";

import { useRouter } from "next-nprogress-bar";
import { useState } from "react";

import { api } from "@/trpc/react";

export function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ content });
      }}
      className="flex flex-col gap-2 "
    >
      <input
        type="text"
        placeholder="Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-black px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full border border-black bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
