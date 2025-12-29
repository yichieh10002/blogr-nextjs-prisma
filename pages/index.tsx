import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";

// ===============================
// 1️⃣ 從資料庫讀取「已發布文章」
// ===============================
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }, // 👉 從新到舊排序（你真正想要的）
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  // ===============================
  // ⭐【新增】序列化 Date（重點）
  // Next.js 的 props 不能直接帶 Date
  // 所以要在「這裡」轉成 string
  // ===============================
  const serializedFeed = feed.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));

  // ===============================
  // 2️⃣ ISR（Incremental Static Regeneration）
  // 每 10 秒重新生成一次頁面
  // ===============================
  return {
    props: { feed: serializedFeed }, // 👉 用「轉換後」的資料
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[];
};

// ===============================
// 3️⃣ 主頁元件（只負責畫畫面）
// ===============================
const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>

      {/* 樣式是教學裡直接寫在這個檔案的 */}
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Blog;
