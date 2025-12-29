// import { getSession } from "next-auth/react";
// import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
// export default async function handle(req, res) {
//   const { title, content } = req.body;

//   const session = await getSession({ req });
//   const result = await prisma.post.create({
//     data: {
//       title: title,
//       content: content,
//       author: { connect: { email: session?.user?.email } },
//     },
//   });
//   res.json(result);
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  console.log("➡️ API /api/post HIT");
  // 取得 session
  const session = await getServerSession(req, res, authOptions);
  console.log("➡️ SESSION IN API:", session);

  if (!session) {
    console.log("❌ NO SESSION");
    res.status(401).json({ error: "No session" });
    return;
  }

  if (!session.user) {
    console.log("❌ NO session.user");
    res.status(401).json({ error: "No session.user" });
    return;
  }

  if (!session.user.email) {
    console.log("❌ NO session.user.email");
    res.status(401).json({ error: "No session.user.email" });
    return;
  }

  console.log("✅ ABOUT TO CREATE POST");

  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: { email: session.user.email },
      },
    },
  });

  console.log("🎉 POST CREATED:", post);

  res.json(post);
}
