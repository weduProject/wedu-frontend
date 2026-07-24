import {
  createContext,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  communityPosts,
  type CommunityPost,
} from "./communityDummy";

type CreatePost = {
  title: string;
  category: string;
  content: string;
};

type CommunityContextType = {
  posts: CommunityPost[];
  addPost: (post: CreatePost) => void;
};

const CommunityContext =
  createContext<CommunityContextType | null>(
    null
  );

export function CommunityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [posts, setPosts] =
    useState<CommunityPost[]>(communityPosts);

  const addPost = (post: CreatePost) => {
    const newPost: CommunityPost = {
      id: Date.now(),
      title: post.title,
      category: post.category,
      content: post.content,
      author: "나",
      likes: 0,
      comments: 0,
      date: new Date().toLocaleDateString(),
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        addPost,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context =
    useContext(CommunityContext);

  if (!context) {
    throw new Error(
      "CommunityProvider 안에서 사용해야 합니다."
    );
  }

  return context;
}
